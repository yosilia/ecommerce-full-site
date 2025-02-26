import Layout from "@/components/Components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  background-color: white;
  border-collapse: collapse;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

const PaidStatus = styled.span`
  font-weight: bold;
  color: ${({ paid }) => (paid ? "#047857" : "#b91c1c")};
`;

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        axios.get("/api/orders").then((response) => {
            setOrders(response.data);
        });
    }, []);
    return (
        <Layout>
      <Title>Orders</Title>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Paid</TableHeadCell>
            <TableHeadCell>Recipient</TableHeadCell>
            <TableHeadCell>Products</TableHeadCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  {order.createdAt.replace("T", " ").substring(0, 19)}
                </TableCell>
                <TableCell>
                  <PaidStatus paid={order.paid}>
                    {order.paid ? "Yes" : "No"}
                  </PaidStatus>
                </TableCell>
                <TableCell>
                  {order.name} {order.email}
                  <br />
                  {order.streetAddress}
                  <br />
                  {order.city} {order.postcode}
                  <br />
                  {order.country}
                  <br />
                  {order.phone}
                </TableCell>
                <TableCell>
                  {order.line_items.map((line, index) => (
                    <div key={index}>
                      {line.price_data?.product_data.name} x {line.quantity}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
        </tbody>
      </Table>
    </Layout>
  );
}