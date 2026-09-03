// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CategoryFilterToolbar from "./CategoryFilterToolbar";

describe("CategoryFilterToolbar", () => {
  const sampleCategories = [
    { id: "1", name: "Car" },
    { id: "2", name: "Bike" },
  ];

  it("renders category filter options", () => {
    render(
      <CategoryFilterToolbar
        categories={sampleCategories}
        selectedCategory=""
        onSelectCategory={vi.fn()}
      />,
    );

    expect(screen.getByText(/All Categories/i)).toBeInTheDocument();
    expect(screen.getByText(/Car/i)).toBeInTheDocument();
    expect(screen.getByText(/Bike/i)).toBeInTheDocument();
  });

  it("calls onSelectCategory when a category pill is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <CategoryFilterToolbar
        categories={sampleCategories}
        selectedCategory=""
        onSelectCategory={handleSelect}
      />,
    );

    const carBtn = screen.getByRole("button", { name: /Car/i });
    fireEvent.click(carBtn);
    expect(handleSelect).toHaveBeenCalledWith("Car");
  });
});
