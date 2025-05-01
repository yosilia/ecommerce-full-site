import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Categories from "@/pages/admin/categories";
import axios from "axios";

// Mock Layout so we can drill into children
jest.mock("@/ComponentsAdmin/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));

// Mock withSwal to inject a fake swal prop
const mockFire = jest.fn(() => Promise.resolve({ isConfirmed: true }));
jest.mock("react-sweetalert2", () => ({
  withSwal: (Component) => (props) => <Component {...props} swal={{ fire: mockFire }} />,
}));

// Mock the shared Input component
jest.mock("@/ComponentsUser/CommonStyles", () => ({
  Input: (props) => <input {...props} />,
}));

// Mock axios for API calls
jest.mock("axios");

describe("Categories Admin Page", () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and displays fetched categories in both select and table", async () => {
    // Arrange: axios.get returns one category
    const cats = [
      { _id: "1", name: "Cat1", parent: null, features: [] },
    ];
    axios.get.mockResolvedValueOnce({ data: cats });

    // Act: Render the Categories component
    render(<Categories />);

    // Assert: axios.get called with correct endpoint
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/categories"));

    // The category should appear twice: once as <option>, once as <td>
    const matches = await screen.findAllByText("Cat1");
    expect(matches.length).toBeGreaterThanOrEqual(2);

    // Parent should show "None" in table cell
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("creates a new category and displays it", async () => {
    const newCat = { _id: "2", name: "NewCat", parent: null, features: [] };

    // Mock API calls: initial GET, POST, and subsequent GET
    axios.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [newCat] });
    axios.post.mockResolvedValueOnce({});

    // Render the component
    render(<Categories />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // Fill in category name
    fireEvent.change(screen.getByPlaceholderText("Category Name"), {
      target: { value: "NewCat" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    // Assert: POST called with correct payload
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/categories", {
        name: "NewCat",
        parentCategory: "",
        features: [],
      });
    });

    // New category appears twice
    const newMatches = await screen.findAllByText("NewCat");
    expect(newMatches.length).toBeGreaterThanOrEqual(2);
  });

  it("edits an existing category and pre-fills the form", async () => {
    const cat = {
      _id: "3",
      name: "EditCat",
      parent: { _id: "0", name: "None" },
      features: [{ name: "size", values: ["S", "M"] }],
    };
    axios.get.mockResolvedValueOnce({ data: [cat] });

    // Render the component
    render(<Categories />);
    // Wait for category to load
    const allMatches = await screen.findAllByText("EditCat");
    expect(allMatches.length).toBeGreaterThanOrEqual(2);

    // Click the Edit button
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    // Assert: Form switches to Edit mode
    expect(screen.getByText("Edit Category EditCat")).toBeInTheDocument();

    // Assert: Inputs pre-filled with category data
    expect(screen.getByPlaceholderText("Category Name").value).toBe("EditCat");
    expect(screen.getByPlaceholderText("Feature name (e.g., color)").value).toBe("size");
    expect(screen.getByPlaceholderText("Values (comma separated)").value).toBe("S,M");
  });

  it("deletes a category after confirmation", async () => {
    const cat = { _id: "4", name: "DelCat", parent: null, features: [] };
    // Mock API calls: initial GET, DELETE, and subsequent GET
    axios.get
      .mockResolvedValueOnce({ data: [cat] })
      .mockResolvedValueOnce({ data: [] });
    axios.delete.mockResolvedValueOnce({});

    // Render the component
    render(<Categories />);
    // Wait for DelCat to render
    const delMatches = await screen.findAllByText("DelCat");
    expect(delMatches.length).toBeGreaterThanOrEqual(2);

    // Click Delete
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    // Assert: swal.fire called for confirmation
    await waitFor(() => expect(mockFire).toHaveBeenCalled());

    // Assert: DELETE called with correct URL
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("/api/categories?_id=4");
    });

    // Assert: Category removed from UI
    expect(screen.queryByText("DelCat")).toBeNull();
  });
});
