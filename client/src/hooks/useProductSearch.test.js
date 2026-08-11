import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProductSearch } from "./useProductSearch.js";
import { productService } from "../services/api.js";

vi.mock("../services/api.js", () => ({
  productService: {
    searchProducts: vi.fn(),
  },
}));

describe("useProductSearch Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("initializes with default query and state", () => {
    const { result } = renderHook(() => useProductSearch());
    expect(result.current.query).toBe("");
    expect(result.current.selectedCategory).toBe("all");
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("does not trigger search API for query < 3 characters", async () => {
    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.setQuery("ab");
    });

    await new Promise((r) => setTimeout(r, 400));

    expect(productService.searchProducts).not.toHaveBeenCalled();
    expect(result.current.suggestions).toEqual([]);
  });

  it("triggers search API after 300ms debounce when query >= 3 characters", async () => {
    productService.searchProducts.mockResolvedValueOnce({
      query: "shoes",
      total: 1,
      page: 1,
      limit: 10,
      suggestions: [{ id: "p1", title: "Running Shoes" }],
      categories: [],
    });

    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.setQuery("shoes");
    });

    await waitFor(() => {
      expect(productService.searchProducts).toHaveBeenCalledWith({
        q: "shoes",
        category_id: "",
        limit: 10,
        page: 1,
      });
      expect(result.current.suggestions).toEqual([
        { id: "p1", title: "Running Shoes" },
      ]);
    });
  });

  it("saves and limits recent searches to 5 items", () => {
    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.saveRecentSearch("item1");
      result.current.saveRecentSearch("item2");
      result.current.saveRecentSearch("item3");
      result.current.saveRecentSearch("item4");
      result.current.saveRecentSearch("item5");
      result.current.saveRecentSearch("item6");
    });

    expect(result.current.recentSearches.length).toBe(5);
    expect(result.current.recentSearches[0]).toBe("item6");
  });
});
