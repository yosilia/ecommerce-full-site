import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import NewProduct from "@/pages/admin/products/new";

// --- Mocks ---
// Mock the Layout wrapper component to simplify testing
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));
// Mock the ProductForm component to simplify testing
jest.mock("@/ComponentsAdmin/ProductForm", () => () => (
  <div data-testid="product-form">Product Form</div>
));

describe("NewProduct Page", () => {
  // Test to ensure the NewProduct page renders correctly
  it("renders Layout and ProductForm", () => {
    render(<NewProduct />);
    // Check if the Layout wrapper is rendered
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    // Check if the ProductForm is rendered inside the Layout
    expect(screen.getByTestId("product-form")).toBeInTheDocument();
  });
});