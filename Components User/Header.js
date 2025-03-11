import Link from "next/link";
import styled from "styled-components";
import Center from "@/Components User/Center";
import { useContext } from "react";
import { CartContext } from "@/Components User/CartContext";

const StyledHeader = styled.header`
  background-color: transparent;
  position: relative;
  height: ${({ $showBackground }) => ($showBackground ? "100vh" : "auto")};
  z-index: 1;
`;

const Logo = styled(Link)`
  color: ${({ $darkMode }) => ($darkMode ? "#fff" : "#000")};
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
  color: ${({ $darkMode }) => ($darkMode ? "#fff" : "#000")};
  text-decoration: none;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const BackgroundImage = styled.div`
  background-image: url("/bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
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
  color: ${({ $darkMode }) => ($darkMode ? "#fff" : "#000")};
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Lora", serif;
`;

import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

export default function Header({ showBackground = true, children }) {
  // Accept children
  const { cartProducts } = useContext(CartContext);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/account");
  };

  const hideBackgroundOnPages = [
    "/cart",
    "/account",
    "/custom-design",
    "/collections/all-items",
    "/admin",
  ];
  // Check if the current page is explicitly listed or falls under the /product/* folder
  const isBackgroundHidden =
    hideBackgroundOnPages.includes(router.pathname) ||
    router.pathname.startsWith("/product/");

  showBackground = !isBackgroundHidden;
  const DarkMode = showBackground;

  return (
    <StyledHeader $showBackground={showBackground}>
      {showBackground && <BackgroundImage />}
      <Center>
        <Wrapper>
          <Logo href={"/"} $darkMode={DarkMode}>
            <img
              src="/logo.png"
              alt="DM Touch"
              style={{ width: "100px", height: "60px", marginRight: "10px" }}
            />
            DM Touch
          </Logo>
          <StyledNav $darkMode={DarkMode}>
            <NavigationLink href={"/"} $darkMode={DarkMode}>
              Home
            </NavigationLink>
            <NavigationLink
              href={"/collections/all-items"}
              $darkMode={DarkMode}
            >
              Shop
            </NavigationLink>
            <NavigationLink href={"/about-us"} $darkMode={DarkMode}>
              About Us
            </NavigationLink>
            <NavigationLink href={"/admin"} $darkMode={DarkMode}>
              Admin
            </NavigationLink>

            {user ? (
              <>
                <NavigationLink href={"/myaccount"} $darkMode={DarkMode}>
                  My Account
                </NavigationLink>
                <LogoutButton onClick={handleLogout} $darkMode={DarkMode}>
                  Logout
                </LogoutButton>
              </>
            ) : (
              <NavigationLink href={"/account"} $darkMode={DarkMode}>
                Account
              </NavigationLink>
            )}

            <NavigationLink href={"/cart"} $darkMode={DarkMode}>
              Cart ({cartProducts.length})
            </NavigationLink>
          </StyledNav>
        </Wrapper>
        {children} {/* Add this so AccountPage content is displayed */}
      </Center>
    </StyledHeader>
  );
}
