import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center"; 
import { useContext } from "react";
import { CartContext } from "@/components/CartContext"; 

const StyledHeader = styled.header`
  background-color: transparent;
  position: relative;
  height: ${({ showBackground }) => (showBackground ? "100vh" : "auto")};
  z-index: 1;
`;

const Logo = styled(Link)`
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#000")};  
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  align-items: center;
  width: 100%;
`;

const NavigationLink = styled(Link)`
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#000")};
  text-decoration: none;
`;

const StyledNav = styled.nav`
  display: flex; 
  gap: 15px;
  align-items: center;
`;

const BackgroundImage = styled.div`
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1; 
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#000")};
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Lora", serif;
`;

import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

export default function Header({ showBackground = true, children }) {  // Accept children
  const { cartProducts } = useContext(CartContext);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/account");
  };

  const hideBackgroundOnPages = ["/cart", "/account", "/custom-design"];
  const isBackgroundHidden = hideBackgroundOnPages.includes(router.pathname);

  showBackground = !isBackgroundHidden;
  const darkMode = showBackground; 

  return (
    <StyledHeader showBackground={showBackground}>
      {showBackground && <BackgroundImage />}
      <Center>
        <Wrapper>
          <Logo href={"/"} darkMode={darkMode}>
            <img 
              src="/logo.png" 
              alt="DM Touch" 
              style={{ width: '100px', height: '60px', marginRight: '10px' }} 
            />
            DM Touch
          </Logo>
          <StyledNav darkMode={darkMode}>
            <NavigationLink href={"/"} darkMode={darkMode}>Home</NavigationLink>
            <NavigationLink href={"/shop"} darkMode={darkMode}>Shop</NavigationLink>
            <NavigationLink href={"/about-us"} darkMode={darkMode}>About Us</NavigationLink>
            {user ? (
              <>
                <NavigationLink href={"/myaccount"} darkMode={darkMode}>My Account</NavigationLink>
                <LogoutButton onClick={handleLogout} darkMode={darkMode}>Logout</LogoutButton>
              </>
            ) : (
              <NavigationLink href={"/account"} darkMode={darkMode}>Account</NavigationLink>
            )}
            <NavigationLink href={"/cart"} darkMode={darkMode}>
              Cart ({cartProducts.length})
            </NavigationLink>
          </StyledNav>
        </Wrapper>
        {children}  {/* Add this so AccountPage content is displayed */}
      </Center>
    </StyledHeader>
  );
}
