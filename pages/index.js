import { useContext } from "react";
import Header from "@/Components User/Header";
import Featured from "@/Components User/Featured";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";
import NewProducts from "@/Components User/NewProducts";
import { AuthContext } from "@/context/AuthContext";
import CategoriesBar from "@/Components User/CategoriesBar";

export default function Home({ newProducts, categories }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Welcome {user ? user.name : ""}</h1>
      </div>
      <CategoriesBar categories={categories} />
      <Featured />
      <NewProducts products={newProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  // Fetch new products
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});

  // Fetch categories
  const categories = await Category.find({}).lean();

  // Find representative image for each category
  const categoriesWithImages = await Promise.all(
    categories.map(async (category) => {
      const product = await Product.findOne({ category: category._id }).select("photos").lean();
      return {
        ...category,
        image: product?.photos?.[0] || "/placeholder.png", // Use first product image or placeholder
      };
    })
  );

  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      categories: JSON.parse(JSON.stringify(categoriesWithImages)),
    },
  };
}
