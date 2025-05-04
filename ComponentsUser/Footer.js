import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Center from "@/ComponentsUser/Center";

const FooterContainer = styled.footer`
  background: #f8f9fa;
  padding: 2rem 1rem;
  margin-top: auto;
  width: 100%;
  position: relative;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  text-align: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FooterSection = styled.div`
  margin: 1rem;
  flex: 1 1 1 200px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #343a40;
`;

const FooterNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 0.5rem;
  }
  a {
    color: #343a40;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  a {
    color: #343a40;
    text-decoration: none;
    font-size: 1.25rem;
    &:hover {
      color: #0070f3;
    }
  }
`;

const Footer = () => (
    <Center>
  <FooterContainer>
    <FooterContent>
      <FooterSection>
        <SectionTitle>DM Touch</SectionTitle>
        <p>© {new Date().getFullYear()} DM Touch</p>
        <p>All rights reserved.</p>
      </FooterSection>

      <FooterSection>
        <SectionTitle>Quick Links</SectionTitle>
        <FooterNav>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about-us">About</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </FooterNav>
      </FooterSection>

      <FooterSection>
        <SectionTitle>Follow Us</SectionTitle>
        <SocialLinks>
          <a href="https://www.instagram.com/dmtouch/" aria-label="Instagram">📸</a>
        </SocialLinks>
      </FooterSection>
    </FooterContent>
  </FooterContainer>
  </Center>
);

export default Footer;
