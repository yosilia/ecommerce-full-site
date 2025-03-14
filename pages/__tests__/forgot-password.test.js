
import React from "react";
import "@testing-library/jest-dom"; 
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "@/pages/forgot-password";


// Mock the Header component so its internal logic is not executed.
jest.mock("@/ComponentsUser/Header", () => () => (
  <div data-testid="header">Header</div>
));

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    // Clear any previous fetch mocks.
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the forgot password form correctly", () => {
    render(<ForgotPasswordPage />);

    // Check that the Header is rendered.
    expect(screen.getByTestId("header")).toBeInTheDocument();
    // Check that the title "Forgot Password" is rendered.
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    // Check that the email input is rendered.
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    // Check that the submit button is rendered.
    expect(screen.getByRole("button", { name: "Send Reset Link" })).toBeInTheDocument();
  });

  it("submits the form and displays the response message", async () => {
    const fakeMessage = "Reset link sent successfully!";
    
    // Mock global.fetch for the forgot-password API call.
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: fakeMessage }),
    });

    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: "Send Reset Link" });
    
    // Type an email into the input.
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    // Submit the form.
    fireEvent.submit(submitButton.closest("form"));
    
    // Wait for the async call to update the message.
    await waitFor(() => {
      // Check that fetch was called with the correct endpoint and options.
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      });
      
      // Check that the response message is displayed.
      expect(screen.getByText(fakeMessage)).toBeInTheDocument();
    });
  });
});
