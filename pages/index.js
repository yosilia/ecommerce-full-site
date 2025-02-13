import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import NewProducts from "@/components/NewProducts";

export default function Home({newProducts}) {
  return (
    <div>
      <Header/>
      <Featured/>
      <NewProducts products={newProducts}/>
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const newProducts = await Product.find({})
  .sort({ _id: -1 })
  .limit(10);

  return {
    props: {newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}