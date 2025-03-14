
import React from "react";
import "@testing-library/jest-dom"; // Provides matchers like toBeInTheDocument()
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AboutUsPage from "@/pages/about-us";
import axios from "axios";

// --- Mocks --- //

// Mock Header, Center, and Title so they don't interfere with tests.
jest.mock("@/ComponentsUser/Header", () => () => (
  <div data-testid="header">Header</div>
));
jest.mock("@/ComponentsUser/Center", () => ({ children }) => (
  <div data-testid="center">{children}</div>
));
jest.mock("@/ComponentsUser/Title", () => ({ children, ...props }) => (
  <h1 data-testid="title" {...props}>{children}</h1>
));


// Mock axios to simulate API calls.
jest.mock("axios");

describe("AboutUsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the about us content and contact form", () => {
    render(<AboutUsPage />);
    
    // Check that the mocked header is rendered.
    expect(screen.getByTestId("header")).toBeInTheDocument();
    
    // Check that the title "About Us" is rendered.
    expect(screen.getByTestId("title")).toHaveTextContent("About Us");
    
    // Check that one of the paragraphs (using a snippet of text) is visible.
    expect(screen.getByText(/Welcome to DM Touch/i)).toBeInTheDocument();
    
    // Check that the contact form inputs are present.
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
    
    // Check that the submit button is rendered.
    expect(screen.getByRole("button", { name: /Send Message/i })).toBeInTheDocument();
  });

  it("submits the form successfully and resets the form", async () => {
    // Simulate a successful API response.
    axios.post.mockResolvedValueOnce({ data: {} });
    
    render(<AboutUsPage />);
    
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("E-mail");
    const messageTextarea = screen.getByPlaceholderText("Message");
    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    
    // Fill in the form fields.
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageTextarea, { target: { value: "Hello there!" } });
    
    // Submit the form.
    fireEvent.click(submitButton);
    
    // While loading, the button should be disabled and its text should change.
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Sending...");
    
    // Wait for the async actions to finish.
    await waitFor(() => {
      // Verify that axios.post was called with the correct endpoint and payload.
      expect(axios.post).toHaveBeenCalledWith("/api/general-queries", {
        clientName: "John Doe",
        clientEmail: "john@example.com",
        message: "Hello there!",
      });
      // Check that the success message is displayed.
      expect(screen.getByText("Message sent successfully!")).toBeInTheDocument();
      // Ensure the form fields have been cleared.
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(messageTextarea.value).toBe("");
    });
  });

  it("displays error message when form submission fails", async () => {
    // Simulate an API failure.
    axios.post.mockRejectedValueOnce(new Error("Network error"));
    
    render(<AboutUsPage />);
    
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("E-mail");
    const messageTextarea = screen.getByPlaceholderText("Message");
    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageTextarea, { target: { value: "Hello there!" } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Check that the error message is displayed.
      expect(screen.getByText("Failed to send message. Please try again.")).toBeInTheDocument();
    });
  });
});
