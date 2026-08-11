import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeaderSearch from "./HeaderSearch.jsx";
import { productService } from "../../services/api.js";

vi.mock("../../services/api.js", () => ({
  productService: {
    searchProducts: vi.fn(),
  },
}));

describe("HeaderSearch Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders search input with correct placeholder", () => {
    render(<HeaderSearch />);
    const input = screen.getByPlaceholderText(
      "Search products, brands, or categories...",
    );
    expect(input).toBeInDocument();
  });

  it("shows dark background overlay on input focus", () => {
    render(<HeaderSearch />);
    const input = screen.getByPlaceholderText(
      "Search products, brands, or categories...",
    );
    fireEvent.focus(input);
    expect(screen.getByTestId("search-overlay")).toBeInDocument();
  });

  it("displays recent searches when focused and input is empty", () => {
    localStorage.setItem(
      "recent_search_queries",
      JSON.stringify(["running shoes", "jackets"]),
    );
    render(<HeaderSearch />);
    const input = screen.getByPlaceholderText(
      "Search products, brands, or categories...",
    );
    fireEvent.focus(input);

    expect(screen.getByText("Recent Searches")).toBeInDocument();
    expect(screen.getByText("running shoes")).toBeInDocument();
    expect(screen.getByText("jackets")).toBeInDocument();
  });

  it("calls productService.searchProducts when query length >= 3 after debounce", async () => {
    productService.searchProducts.mockResolvedValueOnce({
      query: "hoodie",
      total: 1,
      page: 1,
      limit: 10,
      took_ms: 10,
      categories: [{ id: "cat-apparel", name: "Apparel", count: 1 }],
      suggestions: [
        {
          id: "prod-2",
          title: "Zip-up Hoodie",
          category_id: "cat-apparel",
          category_name: "Apparel",
          price: 59.99,
          thumbnail_url: "",
          tags: ["hoodie"],
        },
      ],
    });

    render(<HeaderSearch />);
    const input = screen.getByPlaceholderText(
      "Search products, brands, or categories...",
    );
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "hoodie" } });

    await waitFor(
      () => {
        expect(productService.searchProducts).toHaveBeenCalledWith({
          q: "hoodie",
          category_id: "",
          limit: 10,
          page: 1,
        });
      },
      { timeout: 1000 },
    );

    await waitFor(() => {
      expect(screen.getByText("Zip-up Hoodie")).toBeInDocument();
    });
  });

  it("renders empty state when no products match search query", async () => {
    productService.searchProducts.mockResolvedValueOnce({
      query: "xyz123",
      total: 0,
      page: 1,
      limit: 10,
      took_ms: 5,
      categories: [],
      suggestions: [],
    });

    render(<HeaderSearch />);
    const input = screen.getByPlaceholderText(
      "Search products, brands, or categories...",
    );
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "xyz123" } });

    await waitFor(
      () => {
        expect(
          screen.getByText("No products found for 'xyz123'"),
        ).toBeInDocument();
        expect(screen.getByText("Clear search")).toBeInDocument();
      },
      { timeout: 1000 },
    );
  });

  it("renders inline error alert when API request fails", async () => {
    productService.searchProducts.mockRejectedValueOnce(
      new Error("Network Error"),
    );

    render(<HeaderSearch />);
    const input = screen.getByPlaceholderText(
      "Search products, brands, or categories...",
    );
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "error-query" } });

    await waitFor(
      () => {
        expect(
          screen.getByText("⚠️ Unable to load suggestions. Retrying..."),
        ).toBeInDocument();
      },
      { timeout: 1000 },
    );
  });
});
