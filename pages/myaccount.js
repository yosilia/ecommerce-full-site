import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "@/componentsuser/Header";
import { AuthContext } from "@/context/AuthContext";
import LongButton from "@/componentsuser/LongButton";
import Button from "@/componentsuser/Button";
import Link from "next/link";
import axios from "axios";
import userOrderUpdates from "./api/hooks/userOrderUpdates";
import userRequestUpdates from "./api/hooks/userRequestUpdates";
import Footer from "@/componentsuser/Footer";

const PageContainer = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: auto;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  justify-content: center;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Lora", serif;
`;

const LogoutButton = styled.button`
  background-color: #fff;
  border: 2px solid #000;
  color: #000;
  padding: 10px 20px;
  font-family: lora;
  font-size: 14px;
  font-weight: italic;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-content: center;
  width: 100%;
  &:hover {
    background-color: #000;
    color: #fff;
  }
  &:focus {
    outline: none;
  }
`;

const OrderItem = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ScrollableContainer = styled.div`
  max-height: 400px; 
  overflow-y: auto;
  padding-right: 10px; 
`;

export default function MyAccount() {
  const { user, setUser, loading } = useContext(AuthContext);
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/account");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setCity(user.city || "");
      setCountry(user.country || "");
      setStreetAddress(user.streetAddress || "");
      setPostcode(user.postcode || "");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserRequests(user.email);
    }
  }, [user]);

  async function fetchUserRequests(email) {
    try {
      const res = await fetch(`/api/design-requests?email=${email}`);
      const data = await res.json();

      if (res.ok) {
        setRequests(data.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching user requests:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/account");
  };

  // Handling saving personal details
  const handleSavePersonalDetails = async () => {
    const res = await fetch("/api/auth/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        phone,
        city,
        country,
        streetAddress,
        postcode,
      }),
    });

    if (res.ok) {
      alert("Personal details saved successfully!");
    } else {
      alert("Error saving details.");
    }
  };

  // Handling fetching orders
  useEffect(() => {
    if (user && user.email) {
      axios
        .get("/api/orders", { params: { email: user.email } })
        .then((response) => {
          setOrders(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [user]);

  // Subscribe to Pusher updates
  userOrderUpdates((update) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === update.orderId ? { ...order, orderStatus: update.orderStatus } : order
      )
    );
  });

  // Subscribe to real-time updates
  userRequestUpdates((update) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req._id === update.requestId ? { ...req, status: update.status } : req
      )
    );
  });

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <PageContainer>
        <h2 style={{ textAlign: "center" }}>Welcome {user?.name}</h2>

        <GridContainer>
          {/* Personal Details */}
          <Box>
            <Title>Personal Details</Title>
            <Input type="text" value={user?.name || ""} readOnly />
            <Input type="email" value={user?.email || ""} readOnly />
            <Input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Street Address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <Input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <LongButton onClick={handleSavePersonalDetails}>Save</LongButton>
          </Box>

          {/* Order History */}
          <Box>
            <Title>Order History</Title>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ScrollableContainer>
                {orders.map((order) => (
                  <OrderItem key={order._id}>
                    <Input type="text" value={`Order #${order._id}`} readOnly />
                    <p>
                      <strong>Status:</strong> {order.orderStatus}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    {order.line_items.map((line, index) => (
                      <p key={index}>
                        {line.price_data?.product_data.name} x {line.quantity}
                      </p>
                    ))}
                  </OrderItem>
                ))}
              </ScrollableContainer>
            )}
          </Box>

          {/* User Requests Section */}
          <Box>
            <ScrollableContainer>
              <Title>Your Requests</Title>
              {requests.length === 0 ? (
                <p>No requests found.</p>
              ) : (
                <table
                  className="basic w-full border mt-4"
                  style={{ tableLayout: "fixed", width: "100%" }}
                >
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req._id} className="border-b">
                        <td>
                          {req.appointmentDate
                            ?.replace("T", " ")
                            .substring(0, 10) || "N/A"}
                        </td>
                        <td>{req.appointmentTime}</td>
                        <td
                          className={`font-bold ${
                            req.status === "Completed"
                              ? "text-green-500"
                              : req.status === "In Progress"
                              ? "text-yellow-500"
                              : req.status === "Declined" ||
                                req.status === "Cancelled"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {req.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </ScrollableContainer>
          </Box>

          {/* Custom Design Request */}
          <Box>
            <Title>Would you like to make a custom design request?</Title>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <Link href="/custom-design">
                <Button>Yes</Button>
              </Link>
              <Button>No</Button>
            </div>
          </Box>
        </GridContainer>
        <LogoutButton style={{ marginTop: "40px" }} onClick={handleLogout}>
          Logout
        </LogoutButton>
      </PageContainer>
      <Footer />
    </>
  );
}
