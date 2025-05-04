
import React from "react";
import "@testing-library/jest-dom"; 
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/pages/reset-password";
import { useRouter } from "next/router";

// --- Mocks --- //

// Mock Header so it renders a simple placeholder.
jest.mock("@/ComponentsUser/Header", () => () => (
  <div data-testid="header">Header</div>
));

// Mock Next.js useRouter to supply a dummy token and track push.
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("ResetPasswordPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Provide a dummy token in the query.
    useRouter.mockReturnValue({
      query: { token: "test-token" },
      push: mockPush,
    });
  });

  it("renders the reset password form correctly", () => {
    render(<ResetPasswordPage />);
    // Check that Header is rendered.
    expect(screen.getByTestId("header")).toBeInTheDocument();
    // Check that the title is rendered (even though it says "Forgot Password").
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    // Check that the new password input is rendered.
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    // Check that the reset password button is rendered.
    expect(screen.getByRole("button", { name: "Reset Password" })).toBeInTheDocument();
  });

  it("submits the reset password form successfully and redirects to /account", async () => {
    const fakeMessage = "Password reset successful!";
    
    // Mock global.fetch to simulate a successful API call.
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: fakeMessage }),
    });

    render(<ResetPasswordPage />);
    
    // Type a new password.
    const passwordInput = screen.getByPlaceholderText("New Password");
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    
    // Submit the form.
    fireEvent.submit(passwordInput.closest("form"));
    
    await waitFor(() => {
      // Verify that fetch was called with the expected endpoint and payload.
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "test-token", password: "newpassword123" }),
      });
      
      // Check that the response message is displayed.
      expect(screen.getByText(fakeMessage)).toBeInTheDocument();
      
      // Check that router.push was called with "/account" upon successful reset.
      expect(mockPush).toHaveBeenCalledWith("/account");
    });
  });
});
