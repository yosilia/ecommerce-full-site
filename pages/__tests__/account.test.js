
import React from "react";
import '@testing-library/jest-dom'; 
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountPage from "@/pages/account";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";

// --- Mocks --- //

// Mock Next.js router so that router.push can be tracked.
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock the Header component so that its internal logic (like cartProducts) doesn’t interfere.
jest.mock("@/ComponentsUser/Header", () => () => (
  <div data-testid="header-mock">Header</div>
));

// Polyfill global.fetch if it’s not already defined.
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({}),
    })
  );
}

describe("AccountPage", () => {
  const mockSetUser = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockRouterPush,
    });
    localStorage.clear();
  });

  it("renders login form correctly", () => {
    render(
      <AuthContext.Provider value={{ setUser: mockSetUser }}>
        <AccountPage />
      </AuthContext.Provider>
    );

    // Check title is "Login"
    expect(screen.getByText("Login")).toBeInTheDocument();
    // Email and password inputs exist.
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    // "Full Name" input should not appear when not registering.
    expect(screen.queryByPlaceholderText("Full Name")).toBeNull();
    // Button text should be "Sign In"
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("toggles to registration mode when link is clicked", () => {
    render(
      <AuthContext.Provider value={{ setUser: mockSetUser }}>
        <AccountPage />
      </AuthContext.Provider>
    );

    // Initially in login mode.
    expect(screen.getByText("Login")).toBeInTheDocument();

    // Click on toggle link ("Create Account")
    const toggleLink = screen.getByText("Create Account");
    fireEvent.click(toggleLink);

    // Now the title should change to "Register" and "Full Name" should appear.
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("submits login form successfully", async () => {
    // Prepare fake responses for login and for fetching user data.
    const fakeToken = "token123";
    const fakeUserData = { name: "Test User", email: "test@example.com" };

    // Mock global.fetch:
    global.fetch = jest.fn()
      // First fetch call: login endpoint
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: fakeToken }),
      })
      // Second fetch call: /api/auth/me endpoint
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeUserData,
      });

    render(
      <AuthContext.Provider value={{ setUser: mockSetUser }}>
        <AccountPage />
      </AuthContext.Provider>
    );

    // Fill in email and password.
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    // Submit the form by triggering submit on the form element.
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.submit(submitButton.closest("form"));

    // Wait for the asynchronous actions.
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe(fakeToken);
      expect(mockSetUser).toHaveBeenCalledWith(fakeUserData);
      expect(mockRouterPush).toHaveBeenCalledWith("/myaccount");
    });
  });

  it("submits registration form successfully", async () => {
    // Toggle to registration mode.
    render(
      <AuthContext.Provider value={{ setUser: mockSetUser }}>
        <AccountPage />
      </AuthContext.Provider>
    );
    fireEvent.click(screen.getByText("Create Account"));

    // Fill in Full Name, Email, and Password.
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "New User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "newpassword" },
    });

    // Prepare fake responses for registration and fetching user data.
    const fakeToken = "token456";
    const fakeUserData = { name: "New User", email: "new@example.com" };

    global.fetch = jest.fn()
      // First call: registration endpoint
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: fakeToken }),
      })
      // Second call: /api/auth/me endpoint
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeUserData,
      });

    // Spy on alert to capture registration success message.
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    // Submit the form.
    const submitButton = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.submit(submitButton.closest("form"));

    // Wait for async actions.
    await waitFor(() => {
      // For registration, an alert should indicate success.
      expect(alertSpy).toHaveBeenCalledWith(
        "Registration successful! You can now log in."
      );
      // After registration, the form should toggle back to login mode.
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    alertSpy.mockRestore();
  });
});
