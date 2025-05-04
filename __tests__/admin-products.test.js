import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";

// 1 Mock Layout so it just renders children
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
    <div data-testid="layout">{children}</div>
));

// 2️ Stub axios
jest.mock("axios");

import Products from "@/pages/admin/products";

describe("Admin Products Page", () => {
    // Mock product data
    const mockProducts = [
        { _id: "p1", title: "Product One", stock: 5 },
        { _id: "p2", title: "Product Two", stock: 0 },
    ];

    beforeEach(() => {
        // Mock axios GET and PUT responses
        axios.get.mockResolvedValue({ data: mockProducts });
        axios.put.mockResolvedValue({});
    });

    it("fetches and displays product list and the add button", async () => {
        // Render the Products component
        render(<Products />);

        // Wait for the GET request to be called
        await waitFor(() =>
            expect(axios.get).toHaveBeenCalledWith("/api/products")
        );

        // Check if the Layout wrapper is rendered
        expect(screen.getByTestId("layout")).toBeInTheDocument();

        // Verify the "Add new Item" link is present
        const addLink = screen.getByRole("link", { name: /Add new Item/i });
        expect(addLink).toBeInTheDocument();
        expect(addLink).toHaveAttribute("href", "/admin/products/new");

        // Wait for product titles to appear
        expect(await screen.findByText("Product One")).toBeInTheDocument();
        expect(await screen.findByText("Product Two")).toBeInTheDocument();

        // Verify stock input fields show initial values
        expect(screen.getByDisplayValue("5")).toBeInTheDocument();
        expect(screen.getByDisplayValue("0")).toBeInTheDocument();
    });

    it("updates stock level when changed", async () => {
        // Render the Products component
        render(<Products />);

        // Wait for product stock inputs to load
        await screen.findByDisplayValue("5");

        // Find the input field for "Product One"
        const input = screen.getByDisplayValue("5");
        // Simulate changing the stock value to 10
        fireEvent.change(input, { target: { value: "10" } });

        // Verify axios PUT request is called with updated stock
        await waitFor(() =>
            expect(axios.put).toHaveBeenCalledWith("/api/products", {
                _id: "p1",
                stock: 10,
            })
        );

        // Verify the input reflects the updated stock value
        await waitFor(() => {
            expect(screen.getByDisplayValue("10")).toBeInTheDocument();
        });
    });
});
