import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import styled from "styled-components";

// Styled Components
const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: ${({ show }) => (show ? "0" : "-100%")};
  width: 100%;
  height: 100vh;
  background-color: #111827;
  color: white;
  padding: 1rem;
  transition: left 0.3s ease-in-out;

  @media (min-width: 768px) {
    position: static;
    width: auto;
    height: auto;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
  }
  h1 {
    font-weight: bold;
    color: white;
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NavItem = styled.li`
  list-style: none;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  transition: color 0.3s ease;

  ${({ active }) =>
    active
      ? `background-color: white; color: #111827; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);`
      : `color: inherit; &:hover { color: #d1d5db; }`}
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  transition: color 0.3s ease;
  font-family: "Lora";
  font-size: 16px;
  height: 24px;
  &:hover {
    color: #d1d5db;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #1f2937;
  border-radius: 10px;
  margin-top: auto;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ProfileText = styled.div`
  p {
    margin: 0;
  }

  .name {
    font-weight: 500;
  }

  .email {
    font-size: 0.8rem;
    color: #9ca3af;
  }
`;

export default function Navbar({ show }) {
  const router = useRouter();
  const { data: session } = useSession();

  async function logout() {
    await router.push("/");
    await signOut();
  }

  return (
    <Sidebar show={show}>
      <StyledLink href="/admin">
        <LogoContainer>
          <img src="/logo.png" alt="DM Touch Logo" />
          <h1>DM Touch</h1>
        </LogoContainer>
      </StyledLink>

      {/* Navigation Links */}
      <NavList>
        <NavItem>
          <StyledLink
            href="/admin/products"
            active={router.pathname === "/admin/products"}
          >
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
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
            <span>Products</span>
          </StyledLink>
        </NavItem>

        <NavItem>
          <StyledLink
            href="/admin/categories"
            active={router.pathname === "/admin/categories"}
          >
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
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span>Categories</span>
          </StyledLink>
        </NavItem>

        <NavItem>
          <StyledLink
            href="/admin/orders"
            active={router.pathname === "/admin/orders"}
          >
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
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
            <span>Orders</span>
          </StyledLink>
        </NavItem>

        <NavItem>
          <StyledLink
            href="/admin/appointments"
            active={router.pathname === "/admin/appointments"}
          >
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
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
              />
            </svg>
            <span>Appointments</span>
          </StyledLink>
        </NavItem>

        <NavItem>
          <StyledLink
            href="/admin/admins"
            active={router.pathname === "/admin/admins"}
          >
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
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
            <span>Manage Admins</span>
          </StyledLink>
        </NavItem>

        <NavItem>
          <StyledLink
            href="/admin/design-requests"
            active={router.pathname === "/admin/design-requests"}
          >
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
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>

            <span>Design Requests</span>
          </StyledLink>
        </NavItem>

        <NavItem>
          <StyledLink
            href="/admin/general-queries"
            active={router.pathname === "/admin/general-queries"}
          >
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
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>

            <span>General Queries</span>
          </StyledLink>
        </NavItem>

        <NavItem>
          <LogoutButton onClick={logout}>
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
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
            <span>Logout</span>
          </LogoutButton>
        </NavItem>
      </NavList>

      {/* Profile Section */}
      <ProfileContainer>
        {session ? (
          <>
            <ProfileImage
              src={session.user.image || "/default-profile.png"}
              alt="Profile"
            />
            <ProfileText>
              <p className="name">{session.user.name}</p>
              <p className="email">{session.user.email}</p>
            </ProfileText>
          </>
        ) : (
          <>
            <ProfileImage src="/default-profile.png" alt="Profile" />
            <ProfileText>
              <p className="name">Guest User</p>
              <p className="email">Not logged in</p>
            </ProfileText>
          </>
        )}
      </ProfileContainer>
    </Sidebar>
  );
}
