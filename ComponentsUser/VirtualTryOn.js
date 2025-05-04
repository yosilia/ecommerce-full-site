import { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: 90vw;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #555;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
 background-color: #fff;
  border: 2px solid #000; 
  color: #000;
  padding: 5px 10px; 
  font-size: 12px; 
  font-weight: italic; 
  text-transform: uppercase; 
  border-radius: 8px;
  cursor: pointer; 
  transition: all 0.3s ease; 
  display: inline-flex;
  align-items: center;
  &:hover {
    background-color: #000; 
    color: #fff; 
  }

  &:focus {
    outline: none; 
  }

  
  ${props => props.block && css`
    display: block;
    width: 100%;
  `} 
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 40vh;
  object-fit: contain;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const TryOnButton = styled.button`
  background-color: #fff;
  border: 2px solid #000; 
  color: #000;
  padding: 5px 10px; 
  font-size: 12px; 
  font-weight: italic; 
  text-transform: uppercase; 
  border-radius: 8px;
  cursor: pointer; 
  transition: all 0.3s ease; 
  display: inline-flex;
  align-items: center;
  margin-top: 12px;
  &:hover {
    background-color: #000; 
    color: #fff; 
  }

  &:focus {
    outline: none; 
  }

  
  ${props => props.block && css`
    display: block;
    width: 100%;
  `} 
`;

export default function VirtualTryOn({ clothingImage, onClose }) {
  const [userFile, setUserFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = e => {
    setError(null);
    setResultImage(null);
    const file = e.target.files[0];
    if (!file) return;
    // Restrict to supported image types
    const supportedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    if (!supportedTypes.includes(file.type)) {
      setError('Image file not supported. Please upload JPEG, PNG, or WebP.');
      return;
    }
    setUserFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  async function uploadToS3(file) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error('S3 upload failed: ' + txt);
    }
    const { links } = await res.json();
    return links[0];
  }

  async function handleTryOn() {
    if (!userFile) return;
    setLoading(true);
    setError(null);

    try {
      const personUrl = await uploadToS3(userFile);
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_image_url: personUrl,
          garment_image_url: clothingImage,
          category: 'auto',
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        const errMsg = json.error && typeof json.error === 'string'
          ? json.error
          : JSON.stringify(json);
        throw new Error(errMsg);
      }
      setResultImage(json.resultUrl);
      setPreviewUrl(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>✕</CloseButton>
        <h2>Virtual Try-On</h2>

        {!resultImage && (
          <>
            <HiddenInput
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <UploadButton htmlFor="file-input">
              {previewUrl ? 'Change Photo' : 'Upload Photo'}
            </UploadButton>
          </>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {previewUrl && !resultImage && (
          <PreviewImage src={previewUrl} alt="Your selfie preview" />
        )}

        {!resultImage && (
          <TryOnButton onClick={handleTryOn} disabled={loading || !previewUrl}>
            {loading ? 'Generating...' : 'Try It On'}
          </TryOnButton>
        )}

        {resultImage && (
          <>
            <h3>Result:</h3>
            <PreviewImage src={resultImage} alt="Virtual try-on result" />
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
