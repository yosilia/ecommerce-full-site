import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyAccount from "@/pages/myaccount";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import axios from "axios";

// Polyfill global fetch if not defined
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({ data: [] }),
    })
  );
}

// --- Mocks --- //

// Mock Next.js router with a default pathname.
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock the Header component to avoid errors from its internal logic
jest.mock("@/ComponentsUser/Header", () => () => (
  <div data-testid="header-mock">Header</div>
));

// Mock the pusher hooks so they don't execute their real code.
jest.mock("../api/hooks/userOrderUpdates", () => jest.fn());
jest.mock("../api/hooks/userRequestUpdates", () => jest.fn());

// Mock axios since it's used for orders.
jest.mock("axios");

describe("MyAccount Page", () => {
  let mockRouterPush;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockRouterPush,
      pathname: "/myaccount",
    });
    // Provide a default resolved value for axios.get to avoid undefined return.
    axios.get.mockResolvedValue({ data: { data: [] } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a loading message when loading is true", () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: true }}>
        <MyAccount />
      </AuthContext.Provider>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("redirects to /account if user is not logged in", async () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: false }}>
        <MyAccount />
      </AuthContext.Provider>
    );
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/account");
    });
  });

  it("displays user's information if logged in", () => {
    const mockUser = {
      name: "Test User",
      email: "testuser@example.com",
      phone: "1234567890",
    };

    render(
      <AuthContext.Provider value={{ user: mockUser, loading: false }}>
        <MyAccount />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Welcome Test User")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("testuser@example.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
  });

  it("shows 'No orders found.' if there are no orders", async () => {
    const mockUser = {
      name: "NoOrders User",
      email: "noorders@example.com",
    };

    // Override fetch for design requests.
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    // For orders, axios.get is already set in beforeEach.
    render(
      <AuthContext.Provider value={{ user: mockUser, loading: false }}>
        <MyAccount />
      </AuthContext.Provider>
    );

    expect(await screen.findByText(/No orders found./i)).toBeInTheDocument();
  });

  it("displays orders with details when orders exist", async () => {
    const mockUser = {
      name: "OrderUser",
      email: "orderuser@example.com",
    };

    const mockOrders = [
      {
        _id: "order123",
        orderStatus: "In Progress",
        createdAt: "2025-01-01T12:00:00Z",
        line_items: [
          {
            price_data: { product_data: { name: "Product A" } },
            quantity: 2,
          },
        ],
      },
    ];

    // Override fetch for design requests.
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    // Override axios.get to return our sample order.
    axios.get.mockResolvedValueOnce({ data: { data: mockOrders } });

    render(
      <AuthContext.Provider value={{ user: mockUser, loading: false }}>
        <MyAccount />
      </AuthContext.Provider>
    );

    // Verify that the order input field shows the order ID.
    expect(
      await screen.findByDisplayValue("Order #order123")
    ).toBeInTheDocument();
    // Instead of checking the text node containing "Status:", check directly for "In Progress".
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    // Verify product details.
    expect(screen.getByText(/Product A x 2/i)).toBeInTheDocument();
  });
});
