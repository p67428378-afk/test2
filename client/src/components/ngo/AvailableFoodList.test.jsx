import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AvailableFoodList from "./AvailableFoodList";

describe("AvailableFoodList Component", () => {
  const mockDonations = [
    {
      id: "d1",
      category: "Cooked Rice & Curry",
      quantity: 15,
      freshness_status: "FRESH",
      estimated_shelf_life: 6,
      pickup_address: "123 Main St",
    },
    {
      id: "d2",
      category: "Baked Bread",
      quantity: 10,
      freshness_status: "WARNING",
      estimated_shelf_life: 2,
      pickup_address: "456 Bakery Ave",
    },
  ];

  it("renders available food items correctly", () => {
    render(
      <AvailableFoodList
        donations={mockDonations}
        selectedDonation={null}
        onSelectDonation={() => {}}
      />,
    );

    expect(screen.getByText("Cooked Rice & Curry")).toBeInTheDocument();
    expect(screen.getByText("Baked Bread")).toBeInTheDocument();
  });

  it("calls onSelectDonation when a food card is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <AvailableFoodList
        donations={mockDonations}
        selectedDonation={null}
        onSelectDonation={handleSelect}
      />,
    );

    const card = screen.getByText("Cooked Rice & Curry");
    fireEvent.click(card);

    expect(handleSelect).toHaveBeenCalledWith(mockDonations[0]);
  });
});
