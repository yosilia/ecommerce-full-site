import Header from "@/componentsuser/Header";
import { useState } from "react";
import { PageContainer, Box, Title, Input, Button } from "@/componentsuser/CommonStyles";
import Footer from "@/componentsuser/Footer";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <>
      <Header />
      <PageContainer>
        <Box>
          <Title>Forgot Password</Title>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Send Reset Link</Button>
          </form>
          {message && <p>{message}</p>}
        </Box>
      </PageContainer>
      <Footer />
    </>
  );
}
