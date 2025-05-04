import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";

// 1. Stub out the admin Layout (so it doesn't pull in useSession)
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => <div>{children}</div>);

// 2. Mock axios before importing the page
jest.mock("axios");

import OrdersPage from "@/pages/admin/orders";

describe("OrdersPage", () => {
  // Mock data for orders
  const mockOrders = [
    {
      _id: "order1",
      createdAt: "2025-01-01T10:00:00.000Z",
      paid: true,
      name: "Alice",
      email: "alice@example.com",
      streetAddress: "123 Main St",
      city: "London",
      postcode: "NW1",
      country: "UK",
      phone: "123456",
      line_items: [
        {
          price_data: { product_data: { name: "Product A" } },
          quantity: 2,
        },
      ],
      orderStatus: "Processing",
    },
  ];

  beforeEach(() => {
    // Mock the axios GET request to return mockOrders
    axios.get.mockResolvedValue({ data: mockOrders });
  });

  it("fetches and displays orders", async () => {
    // Render the OrdersPage component
    render(<OrdersPage />);

    // Verify the API call is made with the correct endpoint
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/orderTime");
    });

    // Check if the order date is displayed
    expect(await screen.findByText("2025-01-01 10:00:00")).toBeInTheDocument();

    // Check if the "Paid" status is displayed as "Yes"
    expect(screen.getByText("Yes")).toBeInTheDocument();

    // Check if the recipient's name and email are displayed
    expect(
      screen.getByText(/Alice\s+alice@example\.com/)
    ).toBeInTheDocument();

    // Check if the street address is displayed
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();

    // Check if the city and postcode are displayed
    expect(screen.getByText(/London\s*NW1/)).toBeInTheDocument();

    // Check if the country and phone number are displayed
    expect(screen.getByText(/UK/)).toBeInTheDocument();
    expect(screen.getByText(/123456/)).toBeInTheDocument();

    // Check if the product line item is displayed
    expect(screen.getByText("Product A x 2")).toBeInTheDocument();

    // Check if the default order status is displayed
    expect(screen.getByDisplayValue("Processing")).toBeInTheDocument();
  });
});
