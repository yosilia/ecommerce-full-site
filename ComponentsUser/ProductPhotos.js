import { useState } from "react";
import styled from "styled-components";

// Styling
const Photo = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const MainPhoto = styled.img`
  max-width: 100%;
  max-height: 200%;
`;

const PhotoButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const PhotoButton = styled.div`
border: 2px solid #ccc;
  ${props => props.active ? `
    border-color: #ccc;
    ` : `
    border-color: transparent;
    opacity: .7;
    `}
  
  height: 60px;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
`;

const MainPhotoWrapper = styled.div`
  text-align: center;
`;

export default function ProductPhotos({ photos }) {
  const [activePhoto, setActivePhoto] = useState(photos?.[0]);

  return (
    <>
      <MainPhotoWrapper>
        <MainPhoto src={activePhoto} />
      </MainPhotoWrapper>
      <PhotoButtons>
        {photos.map((p) => (
          <PhotoButton
            key={p}
            active={p === activePhoto}
            onClick={() => setActivePhoto(p)}
          >
            <Photo src={p} alt="" />
          </PhotoButton>
        ))}
      </PhotoButtons>
    </>
  );
}
