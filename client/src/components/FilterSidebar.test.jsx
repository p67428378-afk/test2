import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FilterSidebar from "./FilterSidebar";

describe("FilterSidebar Component", () => {
  it("renders category options and search input", () => {
    const handleCategory = vi.fn();
    const handleSearch = vi.fn();

    render(
      <FilterSidebar
        selectedCategory="Electronics"
        onSelectCategory={handleCategory}
        searchTerm="earbuds"
        onSearchChange={handleSearch}
        inStockOnly={false}
        onToggleInStock={vi.fn()}
        onResetFilters={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText(/search by name/i)).toHaveValue(
      "earbuds",
    );
    expect(screen.getByRole("button", { name: /audio/i })).toBeInTheDocument();

    const audioBtn = screen.getByRole("button", { name: /audio/i });
    fireEvent.click(audioBtn);
    expect(handleCategory).toHaveBeenCalledWith("Audio");
  });

  it("triggers reset filters when clicked", () => {
    const handleReset = vi.fn();
    render(
      <FilterSidebar
        onSelectCategory={vi.fn()}
        onSearchChange={vi.fn()}
        onToggleInStock={vi.fn()}
        onResetFilters={handleReset}
      />,
    );

    const resetBtn = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
