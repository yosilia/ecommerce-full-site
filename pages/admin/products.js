import Layout from '@/Components Admin/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
`;

const AddButton = styled(Link)`
  background-color: #1f2937;
  color: white;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #374151;
  }
`;

const Table = styled.table`
  width: 100%;
  background-color: white;
  border-collapse: collapse;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 1rem;
`;

const TableHeader = styled.thead`
  background-color: #1f2937;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.875rem;
`;

const TableHeadCell = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 0.875rem;
`;

const ButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px; /* Ensures spacing between icon and text */
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border: none;
  color: white;
  margin-right: 8px;
  
  ${({ variant }) =>
    variant === "edit"
      ? `background-color: #1f2937; &:hover { background-color: #374151; }`
      : `background-color: #b91c1c; &:hover { background-color: #991b1b; }`}
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const StockInput = styled.input`
  width: 60px;
  padding: 6px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  text-align: center;
`;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios.get('/api/products').then((response) => {
      setProducts(response.data);
    });
  }, []);
  const updateStock = async (productId, newStock) => {
    setLoading(true);
    await axios.put('/api/products', { _id: productId, stock: newStock });
    setProducts(products.map(p => p._id === productId ? { ...p, stock: newStock } : p));
    setLoading(false);
  };

  return (
    <Layout>
      <Container>
        <AddButton href="/admin/products/new">Add new Item</AddButton>
      </Container>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell>Item Name</TableHeadCell>
            <TableHeadCell>Edit / Delete</TableHeadCell>
            <TableHeadCell>Stock Level</TableHeadCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.title}</TableCell>
              <TableCell>
                <ButtonLink href={`/admin/products/edit/${product._id}`} variant="edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Edit
                </ButtonLink>
                <ButtonLink href={`/admin/products/delete/${product._id}`} variant="delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  Delete
                </ButtonLink>
              </TableCell>
              <TableCell>
                <StockInput
                  type="number"
                  value={product.stock}
                  onChange={(e) => updateStock(product._id, parseInt(e.target.value))}
                  disabled={loading}
                />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Layout>
  );
}
