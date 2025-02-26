import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchableItems, setSearchableItems] = useState([]);

  // Fetch products, orders, and settings dynamically
  useEffect(() => {
    async function fetchData() {
      try {
        const productsRes = await fetch('/api/products');
        const ordersRes = await fetch('/api/orders');

        if (!productsRes.ok) throw new Error('Failed to fetch products');
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');

        const products = await productsRes.json(); // ✅ Parse JSON safely
        const orders = await ordersRes.json(); // ✅ Parse JSON safely

        setSearchableItems([
          { name: 'Products', link: '/products' },
          { name: 'Orders', link: '/orders' },
          { name: 'Settings', link: '/settings' },
          { name: 'Book Appointments', link: '/book-appointment' },
          ...products.map((product) => ({
            name: product.name,
            link: `/products/${product.id}`,
          })),
          ...orders.map((order) => ({
            name: `Order #${order.id}`,
            link: `/orders/${order.id}`,
          })),
        ]);
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    }

    fetchData();
  }, []);

  // Handle Search Input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter items that match the search term
    if (term) {
      const filtered = searchableItems.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  };

  return (
    <div className="relative w-1/3">
      <input
        type="text"
        placeholder="Search for products, orders, settings..."
        value={searchTerm}
        onChange={handleSearch}
        className="border border-gray-300 px-4 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300 hidden md:block"
      />

      {/* Display Search Results */}
      {filteredResults.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-1 z-10">
          {filteredResults.map((item, index) => (
            <li
              key={index}
              className="p-3 border-b last:border-0 hover:bg-gray-100"
            >
              <Link href={item.link} className="text-gray-700 block">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
