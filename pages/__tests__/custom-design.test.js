
import React from "react";
import "@testing-library/jest-dom"; 
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomDesignPage from "@/pages/custom-design";
import { AuthContext } from "@/context/AuthContext";

// --- Mocks --- //

// Mock Header to simply render its children.
jest.mock("@/ComponentsUser/Header", () => ({ children }) => (
  <div data-testid="header">{children}</div>
));

// Mock MeasurementsSection as a placeholder.
jest.mock("@/ComponentsUser/MeasurementsSection", () => () => (
  <div data-testid="measurements">MeasurementsSection</div>
));

describe("CustomDesignPage", () => {
  const fakeUser = {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
  };

  // Before each test, clear any previous fetch mocks.
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for fetch used in useEffects (fetchLatestRequest & fetchBookedAppointments)
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
  });



  it("renders and pre-fills form fields from user context", async () => {
    render(
      <AuthContext.Provider value={{ user: fakeUser }}>
        <CustomDesignPage />
      </AuthContext.Provider>
    );
    // Wait for the effect to pre-fill the form.
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Your Name").value).toBe(fakeUser.name);
      expect(screen.getByPlaceholderText("Your Email").value).toBe(fakeUser.email);
      expect(screen.getByPlaceholderText("Phone Number").value).toBe(fakeUser.phone);
    });
    expect(screen.getByTestId("measurements")).toBeInTheDocument();
  });

  it("displays available time slots when an appointment date is set (non-Sunday)", async () => {
    // Simulate booked appointments returning an empty array.
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });
    render(
      <AuthContext.Provider value={{ user: fakeUser }}>
        <CustomDesignPage />
      </AuthContext.Provider>
    );
    // Locate the date input directly.
    const dateInput = document.querySelector('input[type="date"]');
    // Set a Monday date (e.g. "2025-01-06").
    fireEvent.change(dateInput, { target: { value: "2025-01-06" } });
    // Wait for the time select element to appear.
    const timeSelect = await waitFor(() =>
      document.querySelector("select")
    );
    expect(timeSelect).toBeInTheDocument();
    // Check that the default option is present.
    expect(screen.getByRole("option", { name: "Select a time" })).toBeInTheDocument();
  });

  it("alerts if appointment date or time is missing on submission", async () => {
    window.alert = jest.fn();
    render(
      <AuthContext.Provider value={{ user: fakeUser }}>
        <CustomDesignPage />
      </AuthContext.Provider>
    );
    // Submit the form without setting appointmentDate or appointmentTime.
    const submitButton = screen.getByRole("button", { name: /Submit Request/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please select an appointment date and time.");
    });
  });

  it("submits the design request successfully and resets appointment fields", async () => {
    window.alert = jest.fn();
    // For the initial useEffects.
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }) // fetchLatestRequest
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) }); // fetchBookedAppointments
  
    // For form submission, simulate a successful response.
    const fakeResponse = { message: "Design request submitted successfully!" };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });
  
    render(
      <AuthContext.Provider value={{ user: fakeUser }}>
        <CustomDesignPage />
      </AuthContext.Provider>
    );
    
    // Set appointment date.
    const dateInput = document.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: "2025-01-06" } }); // Monday
    // Wait for the time select element to appear.
    const timeSelect = await waitFor(() => document.querySelector("select"));
    // Choose a time slot.
    fireEvent.change(timeSelect, { target: { value: "5:00 PM - 6:00 PM" } });
    // Fill additional notes.
    const notesInput = screen.getByPlaceholderText("Additional Notes");
    fireEvent.change(notesInput, { target: { value: "Please design something modern." } });
    // Submit the form.
    const submitButton = screen.getByRole("button", { name: /Submit Request/i });
    fireEvent.submit(submitButton.closest("form"));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Design request submitted successfully!");
      // After submission, the date input should be cleared.
      const updatedDateInput = document.querySelector('input[type="date"]');
      expect(updatedDateInput.value).toBe("");
      // If a select element still exists, its value should be empty.
      const updatedTimeSelect = document.querySelector("select");
      if (updatedTimeSelect) {
        expect(updatedTimeSelect.value).toBe("");
      }
    });
  });
  

  it("handles image upload and remove image functionality", async () => {
    window.alert = jest.fn();
    const fakeLinks = ["http://example.com/image1.jpg"];

    // Use mockImplementation to return a specific response for /api/upload.
    global.fetch.mockImplementation((url) => {
      if (url === "/api/upload") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ links: fakeLinks }),
        });
      }
      // Default for other endpoints.
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: [] }),
      });
    });

    render(
      <AuthContext.Provider value={{ user: fakeUser }}>
        <CustomDesignPage />
      </AuthContext.Provider>
    );

    // Select the file input by its type.
    const fileInputEl = document.querySelector('input[type="file"]');
    // Create a fake file.
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    fireEvent.change(fileInputEl, { target: { files: [file] } });

    // Wait for the image element to appear (an <img> element with alt text "Uploaded 0").
    await waitFor(() => {
      expect(screen.getByAltText("Uploaded 0")).toBeInTheDocument();
    });

    // Click the remove image button (assumed to have text "✕").
    const removeButton = screen.getByRole("button", { name: /✕/i });
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.queryByAltText("Uploaded 0")).toBeNull();
    });
  });
});