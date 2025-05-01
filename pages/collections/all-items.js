import Center from "@/ComponentsUser/Center";
import Header from "@/ComponentsUser/Header";
import ProductsGrid from "@/ComponentsUser/ProductsGrid";
import Title from "@/ComponentsUser/Title";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";
import Category from "@/models/Category";
import { useEffect } from "react";

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
    align-items: stretch;
  }
`;

const SortLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin-right: 10px;
  color: #333;
`;


const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  color: #333;
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #999;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &:checked {
    background-color: #4caf50;
    border-color: #4caf50;
  }

  &:checked::after {
    content: "✔";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: black;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #333;
  }
`;

const SearchInput = styled.input`
  padding: 4px 8px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease-in-out;
  font-family: "lora", serif;

  &:focus {
    border-color: #000;
  }

  @media (min-width: 768px) {
    width: 100%;
  }
`;

export default function AllItemsPage({ products, features }) {
  const router = useRouter();
  const { query } = router;
  const [searchTerm, setSearchTerm] = useState(query.search || "");
  const [showFilters, setShowFilters] = useState(false); // Toggle for Filters UI
  const selectedFilters = query.features ? query.features.split(",") : [];

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

  // Handle Multiple Feature Filter Changes
  function handleFeatureChange(value) {
    let updatedFilters = [...selectedFilters];

    if (updatedFilters.includes(value)) {
      updatedFilters = updatedFilters.filter((item) => item !== value); // Remove if exists
    } else {
      updatedFilters.push(value); // Add if not exists
    }

    const newQuery = { ...query };
    if (updatedFilters.length > 0) {
      newQuery.features = updatedFilters.join(","); // Store as CSV in URL
    } else {
      delete newQuery.features; // Remove filter if empty
    }

    router.replace({ pathname: router.pathname, query: newQuery });
  }

  return (
    <>
      <Header />
      <Center>
        <Title style={{ textAlign: "center" }}>All Items</Title>

        {/* Filters & Sorting Section */}
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Filters Button */}
          <FilterButton onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </FilterButton>
        </SortContainer>

        {/* Filters UI (Only shown when `showFilters` is true) */}
        {showFilters && (
          <FilterContainer>
            {features?.length > 0 && (
              <>
                <SortLabel>Filter By Features:</SortLabel>
                <CheckboxGroup>
                  {features.map((value) => (
                    <CheckboxLabel key={value}>
                      <CheckboxInput
                        type="checkbox"
                        checked={selectedFilters.includes(value)}
                        onChange={() => handleFeatureChange(value)}
                      />
                      {value}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </>
            )}
          </FilterContainer>
        )}

        {products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>
            No products found.
          </p>
        )}
      </Center>
    </>
  );
}

// Fetch all products & unique feature values from all categories
export async function getServerSideProps(context) {
  await mongooseConnect();
  const { sort, features, search } = context.query;

  let productFilter = {}; // Filter object for MongoDB query

  // Apply Multiple Feature Filtering (Filters across all categories)
  if (features) {
    const selectedFeatures = features.split(",");
    const categoriesWithFeatures = await Category.find(
      { "features.values": { $in: selectedFeatures } },
      "_id"
    );
    const categoryIds = categoriesWithFeatures.map((category) => category._id);
    productFilter.category = { $in: categoryIds };
  }

  // Apply Search Filtering (Partial match on product title)
  if (search) {
    productFilter.title = { $regex: search, $options: "i" };
  }

  // Determine Sorting Order
  let sortQuery = { _id: -1 }; // Default: Newest First
  if (sort === "price-low-high") {
    sortQuery = { price: 1 };
  } else if (sort === "price-high-low") {
    sortQuery = { price: -1 };
  } else if (sort === "oldest") {
    sortQuery = { _id: 1 };
  }

  // Fetch sorted & filtered products
  const products = await Product.find(productFilter)
    .populate("category")
    .sort(sortQuery);

  // Fetch all unique feature values from **categories**
  const categories = await Category.find({}, "features");
  const featureValues = [
    ...new Set(
      categories.flatMap((category) =>
        category.features.flatMap((feature) => feature.values)
      )
    ),
  ];

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      features: JSON.parse(JSON.stringify(featureValues)),
    },
  };
}
