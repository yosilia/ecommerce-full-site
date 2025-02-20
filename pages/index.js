import { useContext } from "react";
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import NewProducts from "@/components/NewProducts";
import { AuthContext } from "@/context/AuthContext";

export default function Home({ newProducts }) {
  const { user, loading } = useContext(AuthContext); // Access user state

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Welcome {user ? user.name : "Guest"}!</h1>
      </div>
      <Featured />
      <NewProducts products={newProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const newProducts = await Product.find({}).sort({ _id: -1 }).limit(10);

  return {
    props: { newProducts: JSON.parse(JSON.stringify(newProducts)) },
  };
}
