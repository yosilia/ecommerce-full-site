import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import EditProductPage from "@/pages/admin/products/edit/[...id]";
import { useRouter } from "next/router";
import axios from "axios";

// --- Mocks ---
// Mock Layout wrapper to simplify rendering
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));
// Mock ProductForm to assert on its props
jest.mock("@/ComponentsAdmin/ProductForm", () => (props) => (
  <div data-testid="product-form">{JSON.stringify(props)}</div>
));
// Mock next/router to control route behavior
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
// Mock axios for API calls
jest.mock("axios");

describe("EditProductPage", () => {
  const productId = "abc123"; // Example product ID

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("fetches product info and renders ProductForm with props", async () => {
    // Mock router to provide a query with the product ID
    useRouter.mockReturnValue({ query: { id: productId } });
    // Mock product data returned by the API
    const fakeProduct = {
      _id: productId,
      title: "Demo Product",
      price: 99.99,
      description: "Test desc",
    };
    axios.get.mockResolvedValueOnce({ data: fakeProduct }); // Mock API response

    render(<EditProductPage />); // Render the page

    // Wait for axios.get to be called with the correct API endpoint
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/products?id=${productId}`
      )
    );

    // Assert that ProductForm is rendered with the correct props
    const form = await screen.findByTestId("product-form");
    expect(form).toBeInTheDocument();
    // Check that the props include the mocked product data
    expect(form).toHaveTextContent(`"title":"Demo Product"`);
    expect(form).toHaveTextContent(`"price":99.99`);
    expect(form).toHaveTextContent(`"description":"Test desc"`);
  });

  it("does not fetch or render form when no id is in query", async () => {
    // Mock router to provide an empty query
    useRouter.mockReturnValue({ query: {} });
    render(<EditProductPage />); // Render the page

    // Assert that axios.get is not called
    expect(axios.get).not.toHaveBeenCalled();
    // Assert that ProductForm is not rendered
    expect(screen.queryByTestId("product-form")).toBeNull();
  });
});
