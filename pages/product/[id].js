import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import CartIcon from "@/components/icons/CartIcon";
import ProductPhotos from "@/components/ProductPhotos";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { useContext } from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from 'next/link';


const ColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 40px;
  margin-top: 40px;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.2rem;
`;

const RecommendationsWrapper = styled.div`
  margin-top: 40px;
`;

const RecommendationList = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const RecommendationCard = styled.a`
  display: block;
  width: 150px;
  text-align: center;
  text-decoration: none;
  color: inherit;
`;

const RecommendationImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
`;

export default function ProductPage({ product }) {
  const { addProduct } = useContext(CartContext);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function fetchRecommendations() {
      const res = await fetch(`/api/recommendations?id=${product._id}`);
      const data = await res.json();
      setRecommendations(data);
    }
    fetchRecommendations();
  }, [product._id]);

  return (
    <>
      <Header />
      <Center key={product._id}>
      <ColumnWrapper>
          <WhiteBox>
            <ProductPhotos photos={product.photos}></ProductPhotos>
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>£{product.price}</Price>
              </div>
              <div>
                <Button onClick={() => addProduct(_id)}>
                  <CartIcon className="w-4 h-4" /> Add to cart
                </Button>
              </div>
            </PriceRow>
            <div style={{ marginTop: "40px" }}>
            <RecommendationsWrapper>
              <p>Recommended Products</p>
              <RecommendationList>
                {recommendations.map((recProduct) => (
                  <Link key={recProduct._id} href={`/product/${recProduct._id}`} passHref>
                    <RecommendationCard>
                      <RecommendationImage
                        src={
                          recProduct.photos && recProduct.photos.length > 0
                            ? recProduct.photos[0]
                            : '/placeholder.jpg'
                        }
                        alt={recProduct.title}
                      />
                      <p>{recProduct.title}</p>
                    </RecommendationCard>
                  </Link>
                ))}
              </RecommendationList>
            </RecommendationsWrapper>
            </div>
          </div>
        </ColumnWrapper>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
