import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GeneralQueriesAdmin from "@/pages/admin/general-queries";

// Mock Layout wrapper
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));

describe("GeneralQueriesAdmin Page", () => {
  const sampleQuery = {
    _id: "q1",
    clientName: "Jane Doe",
    clientEmail: "jane@example.com",
    message: "Hi there",
    response: "",
  };

  it("fetches and displays queries with response input", async () => {
    // Mock the fetch API for the initial GET request
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [sampleQuery] }) });

    // Render the GeneralQueriesAdmin component
    render(<GeneralQueriesAdmin />);

    // Wait for the query data to be displayed in the table
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
    // Check that the response input field is displayed
    expect(screen.getByPlaceholderText("Write response...")).toBeInTheDocument();
    // Check that the Respond button is displayed
    expect(screen.getByRole("button", { name: "Respond" })).toBeInTheDocument();
  });

  it("submits a response and updates the table", async () => {
    const updatedQuery = { ...sampleQuery, response: "Thanks for reaching out!" };

    // Mock the fetch API for GET, PUT, and refetch GET requests
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [sampleQuery] }) }) // Initial GET
      .mockResolvedValueOnce({ ok: true }) // PUT update
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [updatedQuery] }) }); // Refetch GET

    // Render the GeneralQueriesAdmin component
    render(<GeneralQueriesAdmin />);
    await screen.findByText("Jane Doe");

    // Simulate typing a response into the input field
    fireEvent.change(screen.getByPlaceholderText("Write response..."), {
      target: { value: "Thanks for reaching out!" },
    });
    // Simulate clicking the Respond button
    fireEvent.click(screen.getByRole("button", { name: "Respond" }));

    // Wait for the PUT request to be sent
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/general-queries",
        expect.objectContaining({ method: "PUT" })
      );
    });

    // Verify that the updated response is displayed in the table
    expect(await screen.findByText("Thanks for reaching out!")).toBeInTheDocument();
  });
});
