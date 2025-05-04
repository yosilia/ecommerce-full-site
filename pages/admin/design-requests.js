import { useEffect, useState } from "react";
import Layout from "@/componentsadmin/Layout";
import { useRouter } from "next/router";
import styled from "styled-components";
import MeasurementsSection from "@/componentsuser/MeasurementsSection"; // Adjust the path as needed

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
    variant === "primary"
      ? `background-color: #2563eb; &:hover { background-color: #1e40af; }`
      : variant === "secondary"
      ? `background-color: #374151; &:hover { background-color: #1f2937; }`
      : variant === "danger"
      ? `background-color: #b91c1c; &:hover { background-color: #991b1b; }`
      : `background-color: #047857; &:hover { background-color: #065f46; }`}
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 50%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export default function DesignRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // State for selected request
  const [modalOpen, setModalOpen] = useState(false);
  const [editedMeasurements, setEditedMeasurements] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch("/api/design-requests");
      const data = await res.json();
      setRequests(data.data);
    } catch (error) {
      console.error("Error fetching design requests:", error);
    }
  }

  async function updateStatus(id, status) {
    await fetch("/api/design-requests", {
      method: "PATCH", // Changed to PATCH since we're updating only the status
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchRequests();
  }

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date

    requests.forEach(async (req) => {
      if (req.status === "In Progress" && req.appointmentDate < today) {
        await updateStatus(req._id, "Completed");
      }
    });
  }, [requests]);

  function openModal(request) {
    setSelectedRequest(request);
    setEditedMeasurements(request.measurements || {}); // Initialize state with existing measurements
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedRequest(null);
    setEditedMeasurements({});
  }

  async function handleSave() {
    try {
      const res = await fetch("/api/design-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRequest._id,
          measurements: editedMeasurements,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Measurements updated successfully!");
        // Update the state with the updated design request data
        setSelectedRequest(data.data);
        setEditedMeasurements(data.data.measurements);
        // If you maintain a list of requests, update that list too (if needed)
      } else {
        alert("Error updating measurements: " + data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  }
  

  return (
    <Layout>
      <Container>
        <Title>Design Requests</Title>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadCell>Client</TableHeadCell>
              <TableHeadCell>Created Date</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {requests.map((req) => (
              <TableRow key={req._id}>
                <TableCell>{req.clientName}</TableCell>
                <TableCell>
                  {req.createdAt.replace("T", " ").substring(0, 19)}
                </TableCell>
                <TableCell>{req.status}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => updateStatus(req._id, "Completed")}
                    variant="primary"
                  >
                    Complete
                  </Button>
                  <Button onClick={() => openModal(req)} variant="secondary">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* MODAL FOR REQUEST DETAILS */}
      {modalOpen && selectedRequest && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Custom Design Request</ModalTitle>
            <p>
              <strong>Client Name:</strong> {selectedRequest.clientName}
            </p>
            <p>
              <strong>Email:</strong> {selectedRequest.clientEmail}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRequest.phone}
            </p>
            <p>
              <strong>Appointment Date:</strong>{" "}
              {selectedRequest.appointmentDate
                ?.replace("T", " ")
                .substring(0, 10) || "N/A"}
            </p>
            <p>
              <strong>Appointment Time:</strong>{" "}
              {selectedRequest?.appointmentTime}
            </p>
            <p>
              <strong>Notes:</strong>{" "}
              {selectedRequest.notes || "No additional notes"}
            </p>

            <div>
              <SectionTitle>Measurements (Editable)</SectionTitle>
              <MeasurementsSection
                measurements={editedMeasurements}
                setMeasurements={setEditedMeasurements}
              />
              <Button onClick={handleSave}>Save Changes</Button>
            </div>

            {/* Uploaded Images */}
            {selectedRequest.images && selectedRequest.images.length > 0 && (
              <div>
                <SectionTitle>Uploaded Inspiration Images:</SectionTitle>
                <ImageContainer>
                  {selectedRequest.images.map((img, index) => (
                    <ImagePreview
                      key={index}
                      src={img}
                      alt={`Uploaded Image ${index + 1}`}
                      onClick={() => {
                        const newTab = window.open();
                        newTab.document.write(
                          `<img src="${img}" style="width:100%;">`
                        );
                      }}
                    />
                  ))}
                </ImageContainer>
              </div>
            )}

            {/* Accept & Decline Buttons */}
            {selectedRequest.status === "Pending" && (
              <FlexContainer>
                <Button
                  variant="success"
                  onClick={() => {
                    updateStatus(selectedRequest._id, "In Progress");
                    closeModal();
                    router.push(
                      `/admin/appointments?client=${selectedRequest.clientName}&date=${selectedRequest.appointmentDate}&time=${selectedRequest.appointmentTime}`
                    );
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  onClick={() => updateStatus(selectedRequest._id, "Declined")}
                >
                  Decline
                </Button>
              </FlexContainer>
            )}

            {/* Close Button */}
            <FlexContainer>
              <Button onClick={closeModal} variant="secondary">
                Close
              </Button>
            </FlexContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
}
