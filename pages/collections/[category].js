import React from "react";
import Center from "../../ComponentsUser/Center";
import Header from "../../ComponentsUser/Header";
import ProductsGrid from "../../ComponentsUser/ProductsGrid";
import Title from "../../ComponentsUser/Title";
import { mongooseConnect } from "../../lib/mongoose";
import Product from "../../models/Product";
import Category from "../../models/Category";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useState } from "react";
import Footer from "../../ComponentsUser/Footer";

const NoProductsContainer = styled.div`
  text-align: center;
  font-size: 18px;
  color: red;
  background: #ffecec;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }
`;

const SortLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin-right: 10px;
  color: #333;
`;

const SortSelect = styled.select`
  padding: 4px 8px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  font-family: "lora", serif;
  
  &:hover {
    border-color: #666;
  }
  
  &:focus {
    border-color: #000;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #333;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: #666;
  }
  
  &:focus {
    border-color: #000;
  }
`;

const SearchInput = styled.input`
  padding: 4px 8px;
  width: 250px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease-in-out;
  font-family: "lora", serif;
  
  &:focus {
    border-color: #000;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default function CategoryPage({ products, categoryName, features }) {
  const router = useRouter();
  const { query } = router;
  const [searchTerm, setSearchTerm] = useState(query.search || "");

  // Handle Sorting
  function handleSortChange(e) {
    const selectedSort = e.target.value;
    router.replace({
      pathname: router.pathname,
      query: { ...query, sort: selectedSort },
    });
  }

  // Handle Search Input Change
  function handleSearchChange(e) {
    const newSearch = e.target.value;
    setSearchTerm(newSearch);
    const newQuery = { ...query, search: newSearch || undefined };
    router.replace({ pathname: router.pathname, query: newQuery });
  }

  return (
    <>
      <Header />
      <Center>
        <Title style={{ textAlign: "center" }}>
          {categoryName ? `${categoryName} Collection` : "Category Not Found"}
        </Title>

        {/* Sorting & Search Bar Container */}
        <SortContainer>
          <SortLabel>Sort By:</SortLabel>
          <SortSelect onChange={handleSortChange} value={query.sort || "newest"}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </SortSelect>

          {/* Search Bar */}
          <SearchInput
            type="text"
            placeholder="Search our clothing..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SortContainer>

        {products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>
            No products found in this category.
          </p>
        )}
        <Footer />
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { category, sort, search, ...filters } = context.query;

  const categoryData = await Category.findOne({ slug: category });

  if (!categoryData) {
    return {
      props: {
        categoryName: null,
        products: [],
        features: [],
      },
    };
  }

  const availableFeatures =
    categoryData.features?.map((feature) => ({
      name: feature.name,
      values: feature.values || [],
    })) || [];

  let sortQuery = { _id: -1 };

  if (sort === "price-low-high") {
    sortQuery = { price: 1 };
  } else if (sort === "price-high-low") {
    sortQuery = { price: -1 };
  } else if (sort === "oldest") {
    sortQuery = { _id: 1 };
  }

  let productFilter = { category: categoryData._id };

  Object.keys(filters).forEach((feature) => {
    if (filters[feature] !== "all") {
      productFilter[`features.${feature}`] = filters[feature];
    }
  });

  if (search) {
    productFilter.title = { $regex: search, $options: "i" };
  }

  const products = await Product.find(productFilter)
    .populate("category")
    .select("title photos price category features slug")
    .sort(sortQuery);

  return {
    props: {
      categoryName: categoryData.name,
      products: JSON.parse(JSON.stringify(products)),
      features: JSON.parse(JSON.stringify(availableFeatures)),
    },
  };
}
