
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';

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
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const UploadInput = styled.input`
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const UserImage = styled.img`
  max-width: 300px;
  max-height: 400px;
  display: block;
`;

const ClothingOverlay = styled.img`
  position: absolute;
  opacity: 0.8;
  pointer-events: none;
  /* Additional styles can be added for smooth transitions or effects */
`;

function computeBoundingBox(segmentation) {
  const { data, width, height } = segmentation;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 1) {
      const x = i % width;
      const y = Math.floor(i / width);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return {
    minX, minY, maxX, maxY,
    boxWidth: maxX - minX,
    boxHeight: maxY - minY,
  };
}

const VirtualTryOn = ({ clothingImage, onClose }) => {
  const [userImage, setUserImage] = useState(null);
  const [segmentationData, setSegmentationData] = useState(null);
  const [overlayStyle, setOverlayStyle] = useState({ left: 0, top: 0, width: 0 });


  // Draggable + Scale states
  const [overlayPos, setOverlayPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);


  // Refs
  const imageRef = useRef(null);
  const clothingRef = useRef(null); // <-- nodeRef for Draggable

  // Handle file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUserImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Load the BodyPix model and segment the person once the image is set.
  useEffect(() => {
    async function runSegmentation() {
      const net = await bodyPix.load();
      if (imageRef.current) {
        const segmentation = await net.segmentPerson(imageRef.current);
        setSegmentationData(segmentation);
      }
    }
    if (userImage) {
      runSegmentation();
    }
  }, [userImage]);

  // Compute overlay position and size when segmentation data is available.
  useEffect(() => {
    if (segmentationData && imageRef.current) {
      // Get bounding box of the person from the segmentation data.
      const bbox = computeBoundingBox(segmentationData);

      // Get the displayed image dimensions.
      const rect = imageRef.current.getBoundingClientRect();
      const scaleX = rect.width / segmentationData.width;
      const scaleY = rect.height / segmentationData.height;

      // For demonstration, we position the overlay near the top of the bounding box.
      // Adjust the offsetMultiplier to tweak vertical alignment.
      const offsetMultiplier = 0.2;
      const overlayLeft = bbox.minX * scaleX;
      const overlayTop = bbox.minY * scaleY + bbox.boxHeight * scaleY * offsetMultiplier;
      const overlayWidth = bbox.boxWidth * scaleX;

      setOverlayStyle({
        left: overlayLeft,
        top: overlayTop,
        width: overlayWidth,
      });
    }
  }, [segmentationData]);

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>X</CloseButton>
        <h2>Virtual Try-On</h2>
        <UploadInput type="file" accept="image/*" onChange={handleUpload} />
        {userImage && (
          <ImageWrapper>
            <UserImage ref={imageRef} src={userImage} alt="User" />
            <ClothingOverlay
              src={clothingImage}
              alt="Clothing Overlay"
              style={{
                left: overlayStyle.left,
                top: overlayStyle.top,
                width: overlayStyle.width,
              }}
            />
          </ImageWrapper>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default VirtualTryOn;
