import React from "react";
import "@testing-library/jest-dom"; 
import { render, screen, fireEvent, waitFor } from "@testing-library/react"; 
import DeleteProductPage from "@/pages/admin/products/delete/[...id]"; 
import { useRouter } from "next/router"; 
import axios from "axios"; 

// --- Mocks ---
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div> // Mock Layout component
));
jest.mock("next/router", () => ({
  useRouter: jest.fn(), // Mock useRouter hook
}));
jest.mock("axios"); // Mock axios

describe("DeleteProductPage", () => {
  const mockPush = jest.fn(); // Mock router push function
  const productId = "prod1"; // Mock product ID

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    useRouter.mockReturnValue({
      query: { id: productId }, // Mock query parameter
      push: mockPush, // Mock push function
    });
  });

  it("fetches product info and displays title", async () => {
    // Mock API response for product info
    axios.get.mockResolvedValueOnce({ data: { title: "Test Product" } });

    render(<DeleteProductPage />); // Render the component

    // Verify API call to fetch product info
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(`/api/products?id=${productId}`)
    );

    // Verify heading with fetched product title is displayed
    const heading = await screen.findByRole("heading", {
      name: `Do you really want to delete "Test Product"?`,
    });
    expect(heading).toBeInTheDocument();
  });

  it("goes back when 'No' is clicked", async () => {
    // Mock API response for product info
    axios.get.mockResolvedValueOnce({ data: { title: "X" } });
    render(<DeleteProductPage />); // Render the component

    // Wait for heading to appear
    await screen.findByRole("heading", {
      name: `Do you really want to delete "X"?`,
    });

    // Simulate clicking the "No" button
    fireEvent.click(screen.getByRole("button", { name: "No" }));

    // Verify navigation back to product list
    expect(mockPush).toHaveBeenCalledWith("/admin/products");
  });

  it("deletes and then goes back when 'Yes' is clicked", async () => {
    // Mock API responses for product info and delete action
    axios.get.mockResolvedValueOnce({ data: { title: "X" } });
    axios.delete.mockResolvedValueOnce({});

    render(<DeleteProductPage />); // Render the component

    // Wait for heading to appear
    await screen.findByRole("heading", {
      name: `Do you really want to delete "X"?`,
    });

    // Simulate clicking the "Yes" button
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));

    // Verify API call to delete product and navigation back
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `/api/products?id=${productId}`
      );
      expect(mockPush).toHaveBeenCalledWith("/admin/products");
    });
  });
});
