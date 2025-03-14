import Header from "@/ComponentsUser/Header";
import { useState } from "react";
import { useRouter } from "next/router";
import { PageContainer, Box, Title, Input, Button } from "@/ComponentsUser/CommonStyles";


export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const { token } = router.query; // Get token from URL
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
  
      const data = await res.json();
      setMessage(data.message);
  
      if (res.ok) {
        router.push("/account"); // Redirect after successful reset
      }
    };

  return (
    <>
      <Header />
      <PageContainer>
        <Box>
         <div>
        <Title>Forgot Password</Title>
        <form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Reset Password</Button>
      </form>
      {message && <p>{message}</p>}
      </div>   
        </Box>
      </PageContainer>
      
    </>
  );
}
