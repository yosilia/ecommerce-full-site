// Placing all mocks at the top before importing modules.

jest.mock("@/lib/mongoose", () => ({
    mongooseConnect: jest.fn().mockResolvedValue(),
  }));
  
  jest.mock("@/models/Product", () => ({
    find: jest.fn().mockResolvedValue([
      { _id: "prod1", title: "Product 1", photos: ["img1.jpg"] },
    ]),
    // For findOne, simulate a chainable query.
    findOne: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({ photos: ["img1.jpg"] }),
      }),
    }),
  }));
  
  jest.mock("@/models/Category", () => ({
    find: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue([{ _id: "cat1", name: "Category 1" }]),
    }),
  }));
  
  import React from "react";
  import { render, screen } from "@testing-library/react";
  import Home, { getServerSideProps } from "@/pages/index";
  import { AuthContext } from "@/context/AuthContext";
  import "@testing-library/jest-dom";
  
  // --- Component Mocks ---
  jest.mock("@/ComponentsUser/Header", () => () => (
    <div data-testid="header">Header</div>
  ));
  jest.mock("@/ComponentsUser/Featured", () => () => (
    <div data-testid="featured">Featured</div>
  ));
  jest.mock("@/ComponentsUser/NewProducts", () => () => (
    <div data-testid="new-products">NewProducts</div>
  ));
  jest.mock("@/ComponentsUser/CategoriesBar", () => ({ categories }) => (
    <div data-testid="categories-bar">
      CategoriesBar {categories && categories.length}
    </div>
  ));
  
  describe("Home Page", () => {
    it("shows loading message when loading is true", () => {
      render(
        <AuthContext.Provider value={{ user: null, loading: true }}>
          <Home newProducts={[]} categories={[]} />
        </AuthContext.Provider>
      );
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  
    it("renders home page correctly when not loading", () => {
      const dummyUser = { name: "Alice" };
      const dummyNewProducts = [{ _id: "1", title: "Product 1" }];
      const dummyCategories = [{ _id: "cat1", name: "Category 1", image: "/img.jpg" }];
      
      render(
        <AuthContext.Provider value={{ user: dummyUser, loading: false }}>
          <Home newProducts={dummyNewProducts} categories={dummyCategories} />
        </AuthContext.Provider>
      );
      
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByText("Welcome Alice")).toBeInTheDocument();
      expect(screen.getByTestId("categories-bar")).toHaveTextContent("CategoriesBar 1");
      expect(screen.getByTestId("featured")).toBeInTheDocument();
      expect(screen.getByTestId("new-products")).toBeInTheDocument();
    });
  
    it("getServerSideProps returns expected props", async () => {
      const context = {};
      const result = await getServerSideProps(context);
      expect(result).toHaveProperty("props");
      expect(result.props).toHaveProperty("newProducts");
      expect(result.props).toHaveProperty("categories");
      // Expected dummy data based on mocks:
      expect(result.props.newProducts).toEqual([
        { _id: "prod1", title: "Product 1", photos: ["img1.jpg"] },
      ]);
      // getServerSideProps maps over categories and attaches an image using Product.findOne.
      expect(result.props.categories).toEqual([
        { _id: "cat1", name: "Category 1", image: "img1.jpg" },
      ]);
    });
  });
  