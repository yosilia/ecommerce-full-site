import Button from "@/Components User/Button";
import { CartContext } from "@/Components User/CartContext";
import Center from "@/Components User/Center";
import Header from "@/Components User/Header";
import CartIcon from "@/Components User/icons/CartIcon";
import ProductPhotos from "@/Components User/ProductPhotos";
import Title from "@/Components User/Title";
import WhiteBox from "@/Components User/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { useContext } from "react";
import styled from "styled-components";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import VirtualTryOn from "@/Components User/VirtualTryOn"; 

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

const RecommendationCard = styled.div`
  display: block;
  width: 150px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

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
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [showTryOn, setShowTryOn] = useState(false); 
  // State for modal


   // Fetch current user details on component mount
   useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token'); 
      if (!token) return;
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const user = await res.json();
      if (user && user.email) {
        setCurrentUserEmail(user.email);
      }
    }
    fetchUser();
  }, []);
  
  // Fetch recommendations when product or user email changes
  useEffect(() => {
    async function fetchRecommendations() {
      // Pass an empty string if currentUserEmail is not defined
      const res = await fetch(
        `/api/ai-recommendations?productId=${product._id}&userEmail=${currentUserEmail || ''}`
      );
      const data = await res.json();
      setRecommendations(data);
    }
    fetchRecommendations();
  }, [product._id, currentUserEmail]);
  


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
                <Button onClick={() => addProduct(product._id)}>
                  <CartIcon className="w-4 h-4" /> Add to cart
                </Button>
              </div>
            </PriceRow>
            {/* Virtual Try-On Button */}
            <div style={{ marginTop: "20px" }}>
              <Button onClick={() => setShowTryOn(true)}>
                Try It On Virtually
              </Button>
            </div>
            {/* Render Virtual Try-On modal if showTryOn is true */}
            {showTryOn && (
              <VirtualTryOn 
                clothingImage={
                  product.photos && product.photos.length > 0 
                  ? product.photos[0] // Uses the first photo 
                  : '/placeholder.jpg'
                }
                onClose={() => setShowTryOn(false)}
              />
            )}
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
