import Layout from "@/Components Admin/Layout";
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

const OrderStatusSelect = styled.select`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.9rem;
  font-family: "Lora", serif;
  background-color: #fff;
  color: #333;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orderTime").then((response) => {
      setOrders(response.data);
    });
  }, []);

  // In  admin component (simplified)
  async function updateOrderStatus(orderId, newStatus) {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Order status updated!");
        // Refresh the orders list or update local state
      } else {
        alert("Error updating order status: " + data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  }

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
            <TableHeadCell>Order Status</TableHeadCell>
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
                <TableCell>
                  <OrderStatusSelect
                    defaultValue={order.orderStatus || "Processing"}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </OrderStatusSelect>
                </TableCell>
              </TableRow>
            ))}
        </tbody>
      </Table>
    </Layout>
  );
}
