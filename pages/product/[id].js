import Button from "@/ComponentsUser/Button";
import { CartContext } from "@/ComponentsUser/CartContext";
import Center from "@/ComponentsUser/Center";
import Header from "@/ComponentsUser/Header";
import CartIcon from "@/ComponentsUser/icons/CartIcon";
import ProductPhotos from "@/ComponentsUser/ProductPhotos";
import Title from "@/ComponentsUser/Title";
import WhiteBox from "@/ComponentsUser/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { useContext } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useEffect, useState } from "react";
import VirtualTryOn from "@/ComponentsUser/VirtualTryOn";

const ColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 40px;
  margin-top: 40px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  flex-wrap: nowrap; /* keep everything on one line */
  overflow-x: auto; /* allow scrolling if the row is wider than the container */
  padding: 10px 0;
  scroll-snap-type: x mandatory;

  /* Optional: style the scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;

const RecommendationCard = styled.a`
  flex: 0 0 150px; /* fixed width */
  text-align: center;
  color: inherit;
  text-decoration: none; /* no underline at all */
  scroll-snap-align: start;

  &:hover p {
    text-decoration: underline; /* underline only on hover if you like */
  }
`;

const RecommendationImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
`;

const RecTitle = styled.p`
  margin: 8px 0 0;
  font-size: 0.9rem;
  color: #333;
  text-decoration: none;
`;

export default function ProductPage({ product }) {
  const { addProduct } = useContext(CartContext);
  const [recommendations, setRecommendations] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [showTryOn, setShowTryOn] = useState(false);

  // Fetch current user details
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: "Bearer " + token },
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
      const res = await fetch(
        `/api/ai-recommendations?productId=${product._id}&userEmail=${
          currentUserEmail || ""
        }`
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
            <ProductPhotos photos={product.photos} />
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
            <div style={{ marginTop: "20px" }}>
              <Button onClick={() => setShowTryOn(true)}>
                Try It On Virtually
              </Button>
            </div>
            {showTryOn && (
              <VirtualTryOn
                clothingImage={
                  product.photos && product.photos.length > 0
                    ? product.photos[0]
                    : "/placeholder.jpg"
                }
                onClose={() => setShowTryOn(false)}
              />
            )}
            <div style={{ marginTop: "40px" }}>
              <RecommendationsWrapper>
                <p>Recommended Products</p>
                <RecommendationList>
                  {recommendations.map((recProduct) => (
                    <Link
                      key={recProduct._id}
                      href={`/product/${recProduct._id}`}
                      passHref // so the styled <a> receives the href
                    >
                      <RecommendationCard>
                        <RecommendationImage
                          src={recProduct.photos?.[0] || "/placeholder.jpg"}
                          alt={recProduct.title}
                        />
                        <RecTitle>{recProduct.title}</RecTitle>
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
