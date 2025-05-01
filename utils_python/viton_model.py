import os
import io
import requests
from PIL import Image
import torch
from torchvision import transforms

class VitonHDGenerator:
    def __init__(self, model_path=None, device='cpu'):
        # Choose device: CUDA if available and requested
        self.device = torch.device('cuda' if device == 'cuda' and torch.cuda.is_available() else 'cpu')
        # Determine model path
        if model_path is None:
            model_path = os.getenv('VITON_MODEL_PATH', 'model.pth')
        # Try to load the actual VITON model; if not found, fallback to simple blend
        self.use_simple_blend = False
        if os.path.isfile(model_path):
            from model_arch import VitonHD
            self.model = VitonHD().to(self.device)
            state_dict = torch.load(model_path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            self.model.eval()
            # Pre/postprocessing transforms
            self.preprocess = transforms.Compose([
                transforms.ToTensor(),
                transforms.Normalize([0.5,0.5,0.5], [0.5,0.5,0.5]),
            ])
            self.postprocess = transforms.Compose([
                transforms.Normalize([-1,-1,-1], [2,2,2]),
                transforms.ToPILImage(),
            ])
        else:
            print(f"Warning: model.pth not found at {model_path}. Falling back to simple overlay.")
            self.use_simple_blend = True

    def generate(self, user_img: Image.Image, mask: torch.Tensor, keypoints, cloth_url: str) -> Image.Image:
        # Download and prepare the garment image
        resp = requests.get(cloth_url)
        cloth = Image.open(io.BytesIO(resp.content)).convert('RGBA')
        base = user_img.convert('RGBA')

        if self.use_simple_blend:
            # Simple blend: paste at center top of the user image
            w, h = base.size
            cw, ch = cloth.size
            # position cloth center
            pos = ((w - cw) // 2, int(h * 0.2))
            base.paste(cloth, pos, cloth)
            return base

        # Proceed with full VITON model inference
        # Resize garment to match user image resolution
        garment = cloth.convert('RGB').resize(user_img.size, Image.BILINEAR)

        user_tensor    = self.preprocess(user_img).unsqueeze(0).to(self.device)
        garment_tensor = self.preprocess(garment).unsqueeze(0).to(self.device)
        # Convert mask to tensor shape [B,1,H,W]
        if mask.dim() == 2:
            mask_tensor = mask.unsqueeze(0).unsqueeze(0).float().to(self.device)
        else:
            mask_tensor = mask.float().to(self.device)

        with torch.no_grad():
            output_tensor = self.model(user_tensor, mask_tensor, garment_tensor)

        output_img = self.postprocess(output_tensor.squeeze(0).clamp(-1,1))
        return output_img
