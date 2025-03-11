import { useContext, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "@/Components User/Header";
import { AuthContext } from "@/context/AuthContext";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 100vw; 
  background-color:rgb(233, 232, 230); 
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 40px;
  width: 400px; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;  
  background-color: #fff; /* Ensure not disabled */
  color: #000; 
  &:focus {
    border-color: black; 
  }
`;


const Button = styled.button`
  background-color: #fff;
  border: 2px solid #000; 
  color: #000;
  padding: 5px 10px; 
  font-size: 12px; 
  font-weight: italic; 
  text-transform: uppercase; 
  border-radius: 8px;
  cursor: pointer; 
  transition: all 0.3s ease; 
  display: inline-flex;
  align-items: center;
  justify-content: center; 

  &:hover {
    background-color: #000; 
    color: #fff; 
  }

  &:focus {
    outline: none; 
  }
`;


const LinkContainer = styled.div`
  margin-top: 15px;
  font-size: 12px;
`;

const StyledLink = styled.a`
  color: black;
  text-decoration: none;
  font-weight: bold;
  margin: 0 10px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

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
