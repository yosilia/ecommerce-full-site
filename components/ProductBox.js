import styled from "styled-components";
import PrimaryButton from "./PrimaryButton";
import CartIcon from "./icons/CartIcon";

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
`;

const WhiteBox = styled.div`
  background-color: transparent;
  padding: 20px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 100%;

  img {
    width: 343px; 
    height: 514px; 
    object-fit: cover;
    display: block;
  }
`;

const ProductInfoBox = styled.div`
  width: 343px; /* Ensures text aligns with image width */
  text-align: center;
`;

const Title = styled.h2`
  font-weight: normal;
  font-size: 0.9rem;
  margin: 10px 0 5px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const PriceTag = styled.div`
  font-size: 1rem;
  font-style: italic;
`;

export default function ProductBox({_id, title, description, price, photos}) {
  return (
    <ProductWrapper>
      <WhiteBox>
        <img src={photos[0]} alt={title} />
      </WhiteBox>
      <ProductInfoBox>
        <Title>{title}</Title>
        <PriceRow>
          <PriceTag>£{price}</PriceTag>
          <PrimaryButton>
            <CartIcon />
          </PrimaryButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
