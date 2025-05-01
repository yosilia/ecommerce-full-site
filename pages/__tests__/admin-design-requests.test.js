import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DesignRequestsAdmin from "@/pages/admin/design-requests";
import { useRouter } from "next/router";

// Mock Layout wrapper
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));
// Mock MeasurementsSection
jest.mock("@/ComponentsUser/MeasurementsSection", () => ({ measurements, setMeasurements }) => (
  <div data-testid="measurements">{JSON.stringify(measurements)}</div>
));
// Mock router
const pushMock = jest.fn();
jest.mock("next/router", () => ({ useRouter: jest.fn() }));
useRouter.mockReturnValue({ push: pushMock });

beforeEach(() => {
  // Clear mocks before each test
  jest.clearAllMocks();
});

describe("DesignRequestsAdmin Page", () => {
  // Mock data for design requests
  const alice = {
    _id: "1",
    clientName: "Alice",
    clientEmail: "alice@example.com",
    phone: "123",
    createdAt: "2025-06-01T12:00:00.000Z",
    appointmentDate: "2099-01-01T00:00:00.000Z",
    appointmentTime: "10:00",
    status: "In Progress",
    notes: "Note A",
    measurements: { chest: 30 },
    images: ["img1.jpg"],
  };
  const bob = {
    _id: "2",
    clientName: "Bob",
    clientEmail: "bob@example.com",
    phone: "456",
    createdAt: "2025-06-02T13:00:00.000Z",
    appointmentDate: "2099-01-02T00:00:00.000Z",
    appointmentTime: "11:00",
    status: "Pending",
    notes: "",
    measurements: {},
    images: [],
  };

  it("fetches and displays requests in table", async () => {
    // Mock API response for fetching requests
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [alice, bob] }) });

    render(<DesignRequestsAdmin />);

    // Wait for both names to appear in the table
    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();

    // Check created date and status cells
    expect(screen.getByText(/2025-06-01 12:00:00/)).toBeInTheDocument();
    expect(screen.getAllByText("In Progress")[0]).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();

    // Verify buttons for each request
    expect(screen.getAllByRole("button", { name: "Complete" }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole("button", { name: "View Details" }).length).toBeGreaterThanOrEqual(2);
  });

  it("completes a request and refetches", async () => {
    // Mock API responses for fetching and completing requests
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [alice] }) }) // Initial fetch
      .mockResolvedValueOnce({ ok: true }) // Complete request
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }); // Refetch after completion

    render(<DesignRequestsAdmin />);
    await screen.findByText("Alice");

    // Click "Complete" button for the first request
    fireEvent.click(screen.getAllByRole("button", { name: "Complete" })[0]);

    // Verify API call for completing the request
    await waitFor(() => {
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        "/api/design-requests",
        expect.objectContaining({ method: "PATCH" })
      );
    });

    // Verify Alice is removed after refetch
    await waitFor(() => expect(screen.queryByText("Alice")).toBeNull());
  });

  it("opens modal and shows details, saves changes", async () => {
    // Mock updated data for Bob
    const updated = { ...bob, measurements: { waist: 32 } };

    // Mock API responses for fetching and updating details
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [bob] }) }) // Initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: updated }) }); // Save changes

    window.alert = jest.fn(); // Mock alert

    render(<DesignRequestsAdmin />);
    await screen.findByText("Bob");

    // Open details modal for Bob
    fireEvent.click(screen.getAllByRole("button", { name: "View Details" })[0]);

    // Verify modal content
    expect(screen.getByText("Custom Design Request")).toBeInTheDocument();
    const strongElem = screen.getByText("Client Name:");
    expect(strongElem).toBeInTheDocument();
    expect(strongElem.parentElement).toHaveTextContent("Bob");
    expect(screen.getByTestId("measurements")).toHaveTextContent("{}");

    // Save changes and verify alert
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Measurements updated successfully!"));

    // Verify updated measurements
    expect(screen.getByTestId("measurements")).toHaveTextContent(JSON.stringify(updated.measurements));
  });

  it("accepts pending request, closes modal, and navigates", async () => {
    // Mock API response for fetching requests
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [bob] }) });

    render(<DesignRequestsAdmin />);
    await screen.findByText("Bob");

    // Open details modal for Bob
    fireEvent.click(screen.getAllByRole("button", { name: "View Details" })[0]);
    await screen.findByText("Custom Design Request");

    // Accept request and verify navigation
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    await waitFor(() => expect(useRouter().push).toHaveBeenCalled());
  });
});
