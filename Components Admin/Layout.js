import { useSession, signIn } from 'next-auth/react';
import Navbar from './Navbar';
import { useState } from 'react';
import Logo from './logo';
import styled from 'styled-components';

// Styled Components
const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #f3f4f6;
  position: relative;
`;

const BackgroundLogo = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 50%;
    
    @media (min-width: 768px) {
      width: 33%;
    }

    @media (min-width: 1024px) {
      width: 25%;
    }
  }
`;

const LoginBox = styled.div`
  position: absolute;
  bottom: 10rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const LoginButton = styled.button`
  background-color: #4b5563;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #374151;
    cursor:pointer;
  }
`;

const LayoutContainer = styled.div`
  background-color: #111827;
  min-height: 100vh;
`;

const MobileHeader = styled.div`
  display: block;
  padding: 1rem;

  @media (min-width: 768px) {
    display: none;
  }

  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: white;
  margin: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  if (!session) {
    return (
      <PageContainer>
        {/* Background Logo */}
        <BackgroundLogo>
          <img src="/logo.png" alt="Logo" />
        </BackgroundLogo>

        {/* Login Box */}
        <LoginBox>
          <LoginButton onClick={() => signIn('google')}>
            Login with Google
          </LoginButton>
        </LoginBox>
      </PageContainer>
    );
  }

  return (
    <LayoutContainer>
      <MobileHeader>
        <MenuButton onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </MenuButton>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </MobileHeader>
      <ContentContainer>
        {/* Navbar */}
        <Navbar show={showNav} />
        <MainContent>{children}</MainContent>
      </ContentContainer>
    </LayoutContainer>
  );
}
