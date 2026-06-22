import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PhotoGrid from "./PhotoGrid.jsx";

describe("PhotoGrid Component", () => {
  const mockImages = [
    {
      id: "1",
      url: "https://example.com/img1.jpg",
      title: "Test Image 1",
      gallery_id: "g1",
      gallery_name: "Nature",
    },
  ];

  const mockCategories = [
    { id: "g1", name: "Nature", description: "Nature photos" },
  ];

  it("renders categories and images correctly", () => {
    render(
      <PhotoGrid
        images={mockImages}
        onImageClick={vi.fn()}
        categories={mockCategories}
        selectedCategory="All"
        onCategoryChange={vi.fn()}
      />,
    );

    // Check if category buttons are rendered
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Nature")).toBeInTheDocument();

    // Check if image title is rendered
    expect(screen.getByText("Test Image 1")).toBeInTheDocument();
  });
});
