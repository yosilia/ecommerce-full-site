import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import SaveButton from "@/components/SaveButton";
import Button from "@/components/Button";
import Link from "next/link";

const PageContainer = styled.div`
  padding: 40px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two-column layout */
  gap: 20px;
  max-width: 800px;
  margin: auto;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
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
  background-color: black;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  font-family: "Lora", serif;
  &:hover {
    background-color: #333;
  }
`;

export default function MyAccount() {
  const { user, setUser, loading } = useContext(AuthContext);
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postcode, setPostcode] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/account"); // Redirect if user is null after loading
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
  }, [user]); // Ensures it runs when `user` updates

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/account");
  };

  // handling saving personal details
  const handleSavePersonalDetails = async () => {
    const res = await fetch("/api/auth/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email, // Use email as identifier
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

  if (loading) return <p>Loading...</p>; // Only show loading while fetching

  return (
    <>
      <Header />
      <PageContainer>
        <h2>Welcome {user?.name}</h2>
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
            <SaveButton onClick={handleSavePersonalDetails}>Save</SaveButton>
          </Box>

          {/* Order History */}
          <Box>
            <Title>Order History</Title>
            <Input type="text" value="Order #12345" readOnly />
            <Input type="text" value="Order #67890" readOnly />
          </Box>

          <Box>
            <Title>Would you like to make a custom design request?</Title>

            {/* Parent wrapper with flex and gap */}
            <div style={{ display: "flex", gap: "10px" }}>
              <Link href="/custom-design">
                <Button>Yes</Button>
              </Link>
              <Button>No</Button>
            </div>
          </Box>
        </GridContainer>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </PageContainer>
    </>
  );
}
