import styled from "styled-components";
import Button from "./Button";
import CartIcon from "./icons/CartIcon";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
`;

const WhiteBox = styled(Link)`
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

const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  margin: 10px 0 5px;
  color: inherit;
  text-decoration: none;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const PriceTag = styled.div`
  font-optical-sizing: auto;
  font-size: 1rem;
  font-weight: 500;
  font-style: bold;
`;

export default function ProductBox({ slug, _id, title, description, price, photos }) {
  const { addProduct } = useContext(CartContext);
  const url = "/product/" + slug;
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <img src={photos?.[0]} alt={title} />
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <PriceTag>£{price}</PriceTag>
          <Button onClick={() => addProduct(_id)}>
            <CartIcon className="w-4 h-4" /> Add to cart
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
