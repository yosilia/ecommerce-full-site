import { useEffect, useState } from "react";
import Layout from "@/Components Admin/Layout";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
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

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border: none;
  color: white;
  margin-right: 8px;

  ${({ variant }) =>
    variant === "confirm"
      ? `background-color: #065f46; &:hover { background-color: #047857; }`
      : `background-color: #b91c1c; &:hover { background-color: #991b1b; }`}
`;

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const res = await fetch("/api/design-requests");
    const data = await res.json();

    // Filter only accepted appointments
    const acceptedAppointments = data.data.filter(
      (apt) => apt.status === "In Progress"
    );

    setAppointments(acceptedAppointments);
  }

  async function updateStatus(id, status) {
    await fetch("/api/design-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchAppointments();
  }

  return (
    <Layout>
      <Container>
        <Title>Appointments</Title>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadCell>Client</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Time</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {appointments.map((apt) => (
              <TableRow key={apt._id}>
                <TableCell>{apt.clientName}</TableCell>
                <TableCell>
                  {apt.appointmentDate?.replace("T", " ").substring(0, 10) ||
                    "N/A"}
                </TableCell>
                <TableCell>{apt.appointmentTime}</TableCell>
                <TableCell>{apt.status}</TableCell>
                <TableCell>
                  <Button
                    variant="confirm"
                    onClick={() => updateStatus(apt._id, "Confirmed")}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="cancel"
                    onClick={() => updateStatus(apt._id, "Cancelled")}
                  >
                    Cancel
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
