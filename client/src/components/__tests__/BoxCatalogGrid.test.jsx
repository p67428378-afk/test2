import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import BoxCatalogGrid from "../boxes/BoxCatalogGrid";

describe("BoxCatalogGrid Component", () => {
  const mockBoxes = [
    {
      id: "box-1",
      title: "Gourmet Food Box",
      category_name: "Gourmet Food",
      price: 39.99,
      billing_frequency: "Monthly",
      average_rating: 4.8,
      total_reviews: 12,
      description: "Artisanal snacks and delicacies.",
    },
    {
      id: "box-2",
      title: "Beauty Deluxe Box",
      category_name: "Beauty",
      price: 29.99,
      billing_frequency: "Monthly",
      average_rating: 4.5,
      total_reviews: 8,
      description: "Organic skincare and cosmetics.",
    },
  ];

  it("renders box cards correctly", () => {
    render(
      <MemoryRouter>
        <BoxCatalogGrid boxes={mockBoxes} loading={false} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Gourmet Food Box")).toBeInTheDocument();
    expect(screen.getByText("Beauty Deluxe Box")).toBeInTheDocument();
    expect(screen.getAllByText("View Curation").length).toBe(2);
  });

  it("displays empty state when no boxes are provided", () => {
    const handleReset = vi.fn();
    render(
      <MemoryRouter>
        <BoxCatalogGrid
          boxes={[]}
          loading={false}
          onResetFilters={handleReset}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/No Subscription Boxes Found/i),
    ).toBeInTheDocument();
    const resetButton = screen.getByRole("button", { name: /Reset Filters/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
