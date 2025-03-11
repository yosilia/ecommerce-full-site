import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchableItems, setSearchableItems] = useState([]);

  // Fetch products and orders dynamically
  useEffect(() => {
    async function fetchData() {
      try {
        const productsRes = await fetch("/api/products");
        const ordersRes = await fetch("/api/orders");

        if (!productsRes.ok) throw new Error("Failed to fetch products");
        if (!ordersRes.ok) throw new Error("Failed to fetch orders");

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const products = productsData.data || [];
        const orders = ordersData.data || [];

        setSearchableItems([
          { name: "Products", link: "/admin/products" },
          { name: "Categories", link: "/admin/categories" },
          { name: "Design Request", link: "/admin/design-request" },
          { name: "General Queries", link: "/admin/general-queries" },
          { name: "Orders", link: "/admin/orders" },
          { name: "Appointments", link: "/admin/appointments" },
          ...products.map((product) => ({
            name: product.name,
            link: `/admin/products/${product._id}`,
          })),
          ...orders.map((order) => ({
            name: `Order #${order._id}`,
            link: `/admin/orders/${order._id}`,
          })),
        ]);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    }

    fetchData();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = searchableItems.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  };

  // Handle key down for Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredResults.length > 0) {
      router.push(filteredResults[0].link);
    }
  };

  return (
    <SearchBarContainer>
      <SearchInput
        type="text"
        placeholder="Search for products, orders etc..."
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />

      {/* Display Search Results */}
      {filteredResults.length > 0 && (
        <ResultsList>
          {filteredResults.map((item, index) => (
            <ResultItem key={index}>
              <Link href={item.link}>{item.name}</Link>
            </ResultItem>
          ))}
        </ResultsList>
      )}
    </SearchBarContainer>
  );
}

/* Styled Components */
const SearchBarContainer = styled.div`
  position: relative;
  width: 50%;
`;

const SearchInput = styled.input`
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  width: 100%;
  outline: none;
  transition: box-shadow 0.2s;
  &:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const ResultsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  z-index: 10;
  list-style: none;
  padding: 0;
`;

const ResultItem = styled.li`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f3f4f6;
  }
`;
