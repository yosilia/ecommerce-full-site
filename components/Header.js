import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center"; 

const StyledHeader = styled.header`
  background-color: transparent;
  position: relative;
  height: 100vh; 
  z-index: 1;
`;

const Logo = styled(Link)`
  color: #fff;
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
  color: #fff;
  text-decoration: none;
   &:hover {
    text-decoration: underline;
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

export default function Header() {
  return (
    <StyledHeader>
      <BackgroundImage/>
      <Center>
        <Wrapper>
        <Logo href={"/"}>
        <img src="/logo.png" alt="DM Touch" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
        DM Touch
        </Logo>
        <StyledNav>
          <NavigationLink href={"/"}>Home</NavigationLink>
          <NavigationLink href={"/shop"}>Shop</NavigationLink>
          {/*not sure about categories that's here below thinking of putting that within shop
          if that makes sense */ }
          <NavigationLink href={"/about-us"}>About Us</NavigationLink>
          <NavigationLink href={"/account"}>Account</NavigationLink>
          <NavigationLink href={"/cart"}>Cart (0)</NavigationLink>
        </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
