import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

// Styled Components
const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  transition: color 0.3s ease;
  ${({ active }) =>
    active
      ? `background-color: white; color: #111827; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);`
      : `color: inherit; &:hover { color: #d1d5db; }`}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoText = styled.span`
  font-size: 1rem;
`;

export default function Logo() {
  const router = useRouter();

  return (
    <StyledLink href="/admin" active={router.pathname === "/admin"}>
      <IconContainer>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width="24"
          height="24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        <LogoText>Dashboard</LogoText>
      </IconContainer>
    </StyledLink>
  );
}
