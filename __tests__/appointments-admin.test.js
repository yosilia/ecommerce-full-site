import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppointmentsAdmin from "@/pages/admin/appointments";

// Mock Layout wrapper to simplify testing
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
    <div data-testid="layout">{children}</div>
));

describe("AppointmentsAdmin Page", () => {
    // Mock appointment data
    const inProgressApt = {
        _id: "1",
        clientName: "Alice",
        appointmentDate: "2025-06-01T00:00:00.000Z",
        appointmentTime: "10:00",
        status: "In Progress",
    };
    const completedApt = {
        _id: "2",
        clientName: "Bob",
        appointmentDate: "2025-06-02T00:00:00.000Z",
        appointmentTime: "11:00",
        status: "Completed",
    };

    beforeEach(() => {
        // Clear mocks and reset fetch before each test
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it("fetches and displays only 'In Progress' appointments", async () => {
        // Mock fetch to return both In Progress and Completed appointments
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [inProgressApt, completedApt] }),
        });

        render(<AppointmentsAdmin />);

        // Verify 'In Progress' appointment is displayed
        expect(await screen.findByText("Alice")).toBeInTheDocument();

        // Verify 'Completed' appointment is not displayed
        expect(screen.queryByText("Bob")).toBeNull();
    });

    it("confirms an appointment (PATCH) then refetches, removing it from the list", async () => {
        // Mock fetch: initial list, PATCH response, and updated list
        global.fetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [inProgressApt] }) }) // Initial fetch
            .mockResolvedValueOnce({ ok: true }) // PATCH response
            .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }); // Refetch after PATCH

        render(<AppointmentsAdmin />);

        // Wait for initial appointment to load
        await screen.findByText("Alice");

        // Simulate clicking the "Confirm" button
        fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

        // Verify PATCH request is sent with correct data
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "/api/design-requests",
                expect.objectContaining({
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: "1", status: "Confirmed" }),
                })
            );
        });

        // Verify appointment is removed after refetch
        await waitFor(() => {
            expect(screen.queryByText("Alice")).toBeNull();
        });
    });

    it("cancels an appointment (PATCH) then refetches, removing it from the list", async () => {
        // Mock fetch: initial list, PATCH response, and updated list
        global.fetch
            .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [inProgressApt] }) }) // Initial fetch
            .mockResolvedValueOnce({ ok: true }) // PATCH response
            .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }); // Refetch after PATCH

        render(<AppointmentsAdmin />);

        // Wait for initial appointment to load
        await screen.findByText("Alice");

        // Simulate clicking the "Cancel" button
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        // Verify PATCH request is sent with correct data
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "/api/design-requests",
                expect.objectContaining({
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: "1", status: "Cancelled" }),
                })
            );
        });

        // Verify appointment is removed after refetch
        await waitFor(() => {
            expect(screen.queryByText("Alice")).toBeNull();
        });
    });
});
