import { useEffect, useState } from "react";
import Layout from "@/Components Admin/Layout";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

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


const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border: none;
  color: white;
  background-color: #1f2937;

  &:hover {
    background-color: #374151;
  }
`;

export default function GeneralQueriesAdmin() {
  const [queries, setQueries] = useState([]);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  async function fetchQueries() {
    const res = await fetch("/api/general-queries");
    const data = await res.json();
    setQueries(data.data);
  }

  async function updateQuery(id, response, status) {
    await fetch("/api/general-queries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, response, status }),
    });
    fetchQueries();
  }

  return (
    <Layout>
      <Container>
        <Title>Customer Queries</Title>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadCell>Client</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Message</TableHeadCell>
              <TableHeadCell>Response</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {queries.map((query) => (
              <TableRow key={query._id}>
                <TableCell>{query.clientName}</TableCell>
                <TableCell>{query.clientEmail}</TableCell>
                <TableCell>{query.message}</TableCell>
                <TableCell>
                  {query.response || (
                    <Input
                      type="text"
                      placeholder="Write response..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button onClick={() => updateQuery(query._id, responseText, "Resolved")}>
                    Respond
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Container>
    </Layout>
  );
}