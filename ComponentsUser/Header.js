import Link from "next/link";
import Image from "next/image"; // <-- Import Next.js Image
import styled from "styled-components";
import Center from "@/componentsuser/Center";
import { useContext, useState } from "react";
import { CartContext } from "@/componentsuser/CartContext";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import MenueBarIcon from "./icons/MenueBar";

const StyledHeader = styled.header`
  background-color: transparent;
  position: relative;
  /* Keeps the full-height hero if showBackground is true */
  height: ${({ $showBackground }) => ($showBackground ? "100vh" : "auto")};
  z-index: 1;
  @media screen and (max-width: 767px) {
    height: auto;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden; 
  /* If you want a parallax-like effect, you can explore
     a custom solution. background-attachment: fixed doesn't
     directly translate to Next.js <Image>. */
`;

const BgImage = styled(Image)`
  object-fit: cover;
  object-position: center;
`;

const Logo = styled(Link)`
  color: ${({ $darkMode }) => ($darkMode ? "#fff" : "#000")};
  text-decoration: none;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 3;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  align-items: center;
  width: 100%;
  @media screen and (max-width: 767px) {
    padding: 15px 10px;
  }
`;

const NavigationLink = styled(Link)`
  color: ${({ $darkMode }) => ($darkMode ? "#fff" : "#000")};
  text-decoration: none;
  display: block;
  padding: 15px 0;
  margin-bottom: 15px;
  @media screen and (min-width: 768px) {
    margin-bottom: 0;
    padding: 0;
  }
`;

const StyledNav = styled.nav`
  display: ${({ mobileNavActive }) => (mobileNavActive ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 70px 20px 20px;
  background-color: ${({ $darkMode }) => ($darkMode ? "#000" : "#fff")};
  z-index: 2;
  @media screen and (min-width: 768px) {
    display: flex !important;
    position: static;
    padding: 0;
    gap: 15px;
    align-items: center;
    background-color: transparent;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: ${({ $darkMode }) => ($darkMode ? "#fff" : "#000")};
  padding: 15px 0px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Lora", serif;
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
  color: ${({ $darkMode }) => ($darkMode ? "#fff" : "#000")};
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export default function Header({ showBackground = true, children }) {
  const { cartProducts } = useContext(CartContext);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [mobileNavActive, setMobileNavActive] = useState(false);

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
    "/forgot-password",
    "/reset-password",
  ];

  const isBackgroundHidden =
    hideBackgroundOnPages.includes(router.pathname) ||
    router.pathname.startsWith("/product/");

  showBackground = !isBackgroundHidden;
  const DarkMode = showBackground;

  return (
    <StyledHeader $showBackground={showBackground}>
      {/* Replace the old CSS background with a Next.js Image */}
      {showBackground && (
        <HeroBackground>
          <BgImage
            src="/bg.jpg"
            alt="DM Touch background"
            fill            // occupies the HeroBackground container
            priority        // mark as high-priority for LCP
          />
        </HeroBackground>
      )}

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
          <StyledNav $darkMode={DarkMode} mobileNavActive={mobileNavActive}>
            <NavigationLink href={"/"} $darkMode={DarkMode}>
              Home
            </NavigationLink>
            <NavigationLink href={"/collections/all-items"} $darkMode={DarkMode}>
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
          <NavButton
            onClick={() => setMobileNavActive(!mobileNavActive)}
            $darkMode={DarkMode}
          >
            <MenueBarIcon />
          </NavButton>
        </Wrapper>
        {children}
      </Center>
    </StyledHeader>
  );
}
