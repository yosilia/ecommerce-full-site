import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminsPage from "@/pages/admin/admins";

// Mock only the Layout wrapper
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));

describe("AdminsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default fetch mock for all tests: initial GET returns empty list
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("fetches and displays initial admin list", async () => {
    // Arrange: first fetch returns one admin
    const initialAdmins = [{ email: "admin1@example.com" }];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => initialAdmins,
    });

    // Act
    render(<AdminsPage />);

    // Assert: wait for that email to appear
    expect(
      await screen.findByText("admin1@example.com")
    ).toBeInTheDocument();

    // And a Remove button next to it
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("shows error when adding without email", async () => {
    render(<AdminsPage />);

    // Click Add Admin with no input
    fireEvent.click(screen.getByRole("button", { name: "Add Admin" }));

    // Error should appear synchronously
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("adds a new admin successfully", async () => {
    // Arrange:
    // 1st fetch (initial) => []
    // 2nd fetch (POST)   => ok
    // 3rd fetch (refetch)=> new list
    const newAdmins = [{ email: "new@e.com" }];
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })       // initial GET
      .mockResolvedValueOnce({ ok: true })                             // POST
      .mockResolvedValueOnce({ ok: true, json: async () => newAdmins })// refetch GET

    render(<AdminsPage />);

    // Wait initial GET
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Type and add
    fireEvent.change(screen.getByPlaceholderText("Enter admin email"), {
      target: { value: "new@e.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Admin" }));

    // Assert POST was called correctly
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admins",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "new@e.com" }),
        })
      )
    );

    // Input cleared, no error
    expect(screen.getByPlaceholderText("Enter admin email").value).toBe("");
    expect(screen.queryByText("Email is required")).toBeNull();

    // New admin appears
    expect(await screen.findByText("new@e.com")).toBeInTheDocument();
  });

  it("shows error when addAdmin API fails", async () => {
    // initial GET => []
    // POST => ok: false
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: false });

    render(<AdminsPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    fireEvent.change(screen.getByPlaceholderText("Enter admin email"), {
      target: { value: "fail@e.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Admin" }));

    // Failure error should show
    expect(
      await screen.findByText("Failed to add admin")
    ).toBeInTheDocument();
  });

  it("removes an admin successfully", async () => {
    // Arrange:
    // 1st GET => two admins
    // 2nd DELETE => ok
    // 3rd GET => one admin left
    const initial = [
      { email: "keep@e.com" },
      { email: "remove@e.com" },
    ];
    const after = [{ email: "keep@e.com" }];
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => initial })
      .mockResolvedValueOnce({ ok: true }) // DELETE
      .mockResolvedValueOnce({ ok: true, json: async () => after });

    render(<AdminsPage />);

    // Wait for both in list
    expect(await screen.findByText("remove@e.com")).toBeInTheDocument();

    // Click the second Remove button
    const buttons = screen.getAllByRole("button", { name: "Remove" });
    fireEvent.click(buttons[1]);

    // DELETE called with correct payload
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admins",
        expect.objectContaining({
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "remove@e.com" }),
        })
      )
    );

    // "remove@e.com" should disappear, "keep@e.com" remains
    await waitFor(() =>
      expect(screen.queryByText("remove@e.com")).toBeNull()
    );
    expect(screen.getByText("keep@e.com")).toBeInTheDocument();
  });
});
