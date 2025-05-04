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
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import VirtualTryOn from "@/ComponentsUser/VirtualTryOn";
import styled from "styled-components";
import Footer from "@/ComponentsUser/Footer";

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
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }
`;

const RecommendationCard = styled.a`
  flex: 0 0 150px;
  text-align: center;
  color: inherit;
  text-decoration: none;
  scroll-snap-align: start;
  &:hover p { text-decoration: underline; }
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
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);

   // 1) Fetch current user and mark authLoaded
   useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: "Bearer " + token },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const user = await res.json();
          if (!cancelled && user?.email) {
            setCurrentUserEmail(user.email);
          }
        }
      } catch (e) {
        console.warn("Auth fetch error", e);
      } finally {
        if (!cancelled) setAuthLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Fetch recommendations once, after authLoaded & product ready
  useEffect(() => {
    if (!authLoaded || !product || !product._id) return;

    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const params = new URLSearchParams({ productId: product._id });
        if (currentUserEmail) {
          params.append("userEmail", currentUserEmail);
        }
        const url = `/api/ai-recommendations?${params.toString()}`;
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRecommendations(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch recommendations:", err);
        }
      }
    })();

    return () => controller.abort();
  }, [authLoaded, currentUserEmail, product]);

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
                  Add to cart
                </Button>
              </div>
            </PriceRow>
            <div style={{ marginTop: 20 }}>
              <Button onClick={() => setShowTryOn(true)}>
                Try It On Virtually
              </Button>
            </div>
            {showTryOn && (
              <VirtualTryOn
                clothingImage={product.photos?.[0] || "/placeholder.jpg"}
                onClose={() => setShowTryOn(false)}
              />
            )}
            <RecommendationsWrapper>
              <p>Recommended Products</p>
              <RecommendationList>
                {recommendations.map((rec) => (
                  <Link key={rec._id} href={`/product/${rec.slug}`} passHref>
                    <RecommendationCard>
                      <RecommendationImage
                        src={rec.photos?.[0] || "/placeholder.jpg"}
                        alt={rec.title}
                      />
                      <RecTitle>{rec.title}</RecTitle>
                    </RecommendationCard>
                  </Link>
                ))}
              </RecommendationList>
            </RecommendationsWrapper>
          </div>
        </ColumnWrapper>
        <Footer />
      </Center>
    </>
  );
}

export async function getServerSideProps({ query }) {
  await mongooseConnect();
const { slug } = query;
const product = await Product.findOne({ slug });
if (!product) {
return { notFound: true };
 }
  return { props: { product: JSON.parse(JSON.stringify(product)) } };
}
