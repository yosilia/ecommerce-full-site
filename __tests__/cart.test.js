import React from "react";
import "@testing-library/jest-dom"; 
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartPage from "@/pages/cart";
import { CartContext } from "@/ComponentsUser/CartContext";
import axios from "axios";

// --- Mocks --- //

// Mock Header, Center, and StylingTable so their internal logic doesn’t interfere.
jest.mock("@/ComponentsUser/Header", () => () => (
  <div data-testid="header">Header</div>
));
jest.mock("@/ComponentsUser/Center", () => ({ children }) => (
  <div data-testid="center">{children}</div>
));
jest.mock("@/ComponentsUser/StylingTable", () => ({ children }) => (
  <table data-testid="styling-table">{children}</table>
));

// Mock Button from ComponentsUser/Button and strip out the `block` prop to avoid warnings.
jest.mock("@/ComponentsUser/Button", () => (props) => {
  const { block, ...rest } = props;
  return <button {...rest}>{props.children}</button>;
});

// Mock Input from CommonStyles as a basic input.
jest.mock("@/ComponentsUser/CommonStyles", () => ({
  Input: (props) => <input {...props} />,
}));

// Mock axios so we can simulate API responses.
jest.mock("axios");

describe("CartPage", () => {
  // Dummy functions for CartContext.
  const mockAddProduct = jest.fn();
  const mockRemoveProduct = jest.fn();
  const mockClearCart = jest.fn();

  // Helper function to render CartPage with a provided cartProducts array.
  const renderCartPage = (cartProducts = []) => {
    return render(
      <CartContext.Provider
        value={{
          cartProducts,
          addProduct: mockAddProduct,
          removeProduct: mockRemoveProduct,
          clearCart: mockClearCart,
        }}
      >
        <CartPage />
      </CartContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty cart message when cartProducts is empty", () => {
    renderCartPage([]);
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it("renders cart products and order information when cartProducts is not empty", async () => {
    // Example: cartProducts contains two instances of 'prod1' and one of 'prod2'
    const cartProducts = ["prod1", "prod1", "prod2"];

    // Simulate axios.post call to '/api/cart' returning product details.
    const fakeProducts = [
      { _id: "prod1", title: "Product 1", price: 10, photos: ["photo1.jpg"] },
      { _id: "prod2", title: "Product 2", price: 20, photos: ["photo2.jpg"] },
    ];
    axios.post.mockResolvedValueOnce({ data: fakeProducts });

    renderCartPage(cartProducts);

    // Wait for product details to be loaded.
    await waitFor(() => {
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
    });

    // Check that order information inputs are rendered.
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("calls addProduct and removeProduct when respective buttons are clicked", async () => {
    // Provide a cart with one product: 'prod1'
    const cartProducts = ["prod1"];
    const fakeProducts = [
      { _id: "prod1", title: "Product 1", price: 10, photos: ["photo1.jpg"] },
    ];
    axios.post.mockResolvedValueOnce({ data: fakeProducts });

    renderCartPage(cartProducts);

    await waitFor(() => {
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    });

    // Expect to find buttons with text "-" and "+".
    const removeButton = screen.getByRole("button", { name: "-" });
    const addButton = screen.getByRole("button", { name: "+" });

    fireEvent.click(removeButton);
    expect(mockRemoveProduct).toHaveBeenCalledWith("prod1");

    fireEvent.click(addButton);
    expect(mockAddProduct).toHaveBeenCalledWith("prod1");
  });

  it("handles goToPayment properly", async () => {
    const cartProducts = ["prod1"];
    const fakeProducts = [
      { _id: "prod1", title: "Product 1", price: 10, photos: ["photo1.jpg"] },
    ];
    axios.post.mockResolvedValueOnce({ data: fakeProducts });
    renderCartPage(cartProducts);

    await waitFor(() => {
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    });

    // Fill in order information fields.
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Street Address"), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "UK" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "London" },
    });
    fireEvent.change(screen.getByPlaceholderText("Postcode"), {
      target: { value: "AB12CD" },
    });

    // Simulate axios.post for checkout.
    const fakeCheckoutUrl = "http://payment.com";
    axios.post.mockResolvedValueOnce({ data: { url: fakeCheckoutUrl } });

    // Override window.location with a custom getter/setter to capture assignments.
    let locationHref = "";
    const assignMock = jest.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      get() {
        return {
          href: locationHref,
          assign: assignMock,
        };
      },
      set(val) {
        locationHref = val;
        assignMock(val);
      },
    });

    const paymentButton = screen.getByRole("button", {
      name: /Continue to payment/i,
    });
    fireEvent.click(paymentButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/checkout",
        expect.objectContaining({
          name: "Alice",
          email: "alice@example.com",
          phone: "123456",
          streetAddress: "123 Main St",
          country: "UK",
          city: "London",
          postcode: "AB12CD",
          cartProducts: cartProducts,
        })
      );
      // Verify that window.location was assigned the checkout URL.
      expect(assignMock).toHaveBeenCalledWith(fakeCheckoutUrl);
    });
  });

  it('displays success message and clears cart if URL includes "success"', async () => {
    const cartProducts = ["prod1"];
    const fakeProducts = [
      { _id: "prod1", title: "Product 1", price: 10, photos: ["photo1.jpg"] },
    ];
    axios.post.mockResolvedValueOnce({ data: fakeProducts });

    // Override window.location.href so that it includes "success".
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "http://localhost/success" },
    });

    renderCartPage(cartProducts);

    await waitFor(() => {
      expect(screen.getByText(/Order completed successfully!/i)).toBeInTheDocument();
    });

    // Ensure clearCart is called.
    expect(mockClearCart).toHaveBeenCalled();
  });
});
