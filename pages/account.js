import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/ComponentsUser/Header";
import { AuthContext } from "@/context/AuthContext";
import { PageContainer, Box, Title, Input, Button, LinkContainer, StyledLink } from "@/ComponentsUser/CommonStyles";

export default function AccountPage() {
  const { setUser } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const body = isRegistering ? { name, email, password } : { email, password };
  
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
  
      // 1️⃣ Fetch updated user data from the API
      const userRes = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
  
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData); // 2️⃣ Update AuthContext with fetched user data
      }
  
      // 3️⃣ Ensure redirect happens AFTER state updates
      router.push("/myaccount");
    } else {
      alert(data.message);
    }
  

    if (res.ok) {
      if (!isRegistering) {
        // Store the JWT token and redirect to myaccount page
        localStorage.setItem("token", data.token);
        router.push("/myaccount");  // Redirect to My Account page
      } else {
        // Show success message and switch to login mode after registering
        alert("Registration successful! You can now log in.");
        setIsRegistering(false);
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <Header />
      <PageContainer>
        <Box>
          <Title>{isRegistering ? "Register" : "Login"}</Title>
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">{isRegistering ? "Sign Up" : "Sign In"}</Button>
          </form>
          <LinkContainer>
            <StyledLink onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Already have an account? Login" : "Create Account"}
            </StyledLink>
            •
            <StyledLink href="/forgot-password">Forgot Password</StyledLink>
          </LinkContainer>
        </Box>
      </PageContainer>
    </>
  );
}
