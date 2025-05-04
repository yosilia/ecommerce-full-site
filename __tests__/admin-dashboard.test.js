import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/pages/admin/index";
import Layout from "@/componentsadmin/Layout";
import axios from "axios";
// Mock Layout so we don't have to render children wrappings
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
    <div data-testid="layout">{children}</div>
));

// Mock useSession to avoid authentication
jest.mock("next-auth/react", () => ({
    useSession: () => ({ data: { user: { name: "Admin" } } }),
}));

// Mock styled-components recharts wrappers
jest.mock("recharts", () => ({
    LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>, // Mock LineChart
    Line: () => null, // Mock Line
    XAxis: () => null, // Mock XAxis
    YAxis: () => null, // Mock YAxis
    CartesianGrid: () => null, // Mock CartesianGrid
    Tooltip: () => null, // Mock Tooltip
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>, // Mock ResponsiveContainer
}));

describe("Admin Dashboard Page", () => {
    const nowSec = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const yesterdaySec = nowSec - 24 * 60 * 60; // Timestamp for 24 hours ago

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it("fetches Stripe data and displays statistics", async () => {
        // Mock axios GET requests for Stripe API
        axios.get = jest.fn()
            .mockResolvedValueOnce({
                data: {
                    totalRevenue: 3000, // Mock total revenue
                    paymentIntents: [
                        { amount: 1000, status: "succeeded", created: nowSec }, // Mock successful payment today
                        { amount: 2000, status: "succeeded", created: yesterdaySec }, // Mock successful payment yesterday
                        { amount: 500, status: "failed", created: nowSec }, // Mock failed payment today
                    ],
                },
            })
            .mockResolvedValueOnce({
                data: { available: [ { currency: "gbp", amount: 5000 }, { currency: "usd", amount: 3000 } ] }, // Mock balance data
            });

        render(<Home />); // Render the Home component

        await waitFor(() => {
            // Verify API calls
            expect(axios.get).toHaveBeenCalledWith("/api/stripe/payment-intents");
            expect(axios.get).toHaveBeenCalledWith("/api/stripe/balance");
        });

        // Verify header and total revenue display
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Total Revenue: £30.00")).toBeInTheDocument();

        // Verify today's and yesterday's gross volumes
        expect(screen.getByText("Gross Volume (Today)")).toBeInTheDocument();
        expect(screen.getByText("£10.00")).toBeInTheDocument();
        expect(screen.getByText("Gross Volume (Yesterday)")).toBeInTheDocument();
        expect(screen.getByText("£20.00")).toBeInTheDocument();

        // Verify GBP balance display
        expect(screen.getByText("GBP Balance")).toBeInTheDocument();
        expect(screen.getByText(/£50(?:\.00)?/)).toBeInTheDocument();

        // Verify payouts label
        expect(screen.getByText("Payouts")).toBeInTheDocument();

        // Verify two chart instances are rendered
        expect(screen.getAllByTestId("line-chart")).toHaveLength(2);
    });
});
