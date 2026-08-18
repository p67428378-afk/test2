import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeFilter from "./RecipeFilter";
import { describe, it, expect, vi } from "vitest";

describe("RecipeFilter", () => {
  const categories = [
    { id: "cat-1", name: "Italian" },
    { id: "cat-2", name: "Mexican" },
  ];

  it("renders search input, category selector, and cook time dropdown", () => {
    const handleFilterChange = vi.fn();
    render(
      <RecipeFilter
        categories={categories}
        onFilterChange={handleFilterChange}
      />,
    );

    expect(
      screen.getByPlaceholderText(/Search by recipe title/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Cook Time")).toBeInTheDocument();
    expect(screen.getByText("Favorites Only")).toBeInTheDocument();
  });
});
