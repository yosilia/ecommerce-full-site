
from flask      import Flask, request, jsonify
from PIL        import Image
import io, base64, torch
from viton_model import VitonHDGenerator  

app = Flask(__name__)
generator = VitonHDGenerator(device='cuda')
if __name__ == '__main__':
    # 0.0.0.0 listens on all interfaces, including IPv4 localhost
    app.run(host='0.0.0.0', port=8000)

@app.route('/api/try-on', methods=['POST'])
def try_on():
    data = request.json

    # 1. Retrieve the user image from S3
    resp = requests.get(data['userImageUrl'], stream=True)
    user_img = Image.open(resp.raw).convert('RGB')

    # 2. Rebuild mask tensor
    mask = torch.tensor(data['mask']) \
                .reshape(data['maskHeight'], data['maskWidth']) \
                .unsqueeze(0).to('cuda')

    # 3. Keypoints as before, garment URL unchanged
    keypoints = data['keypoints']
    cloth_url = data['clothingUrl']

    # 4. Generate and return as before
    result = generator.generate(user_img, mask, keypoints, cloth_url)
    # … convert to Base64 or store on S3 and return URL …
