import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SpotCard from "./SpotCard";

describe("SpotCard Component", () => {
  const sampleSpot = {
    spot_id: "spot-123",
    name: "Downtown Garage",
    address: "123 Main St",
    distance_km: 0.5,
    hourly_rate: 6.5,
    status: "AVAILABLE",
    total_capacity: 50,
    available_spots: 20,
    spot_type: "garage",
    has_ev_charging: true,
  };

  it("renders spot details accurately", () => {
    render(<SpotCard spot={sampleSpot} onSelect={() => {}} />);
    expect(screen.getByText("Downtown Garage")).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    expect(screen.getByText("$6.50")).toBeInTheDocument();
    expect(screen.getByText(/20 of 50 spots open/i)).toBeInTheDocument();
  });

  it("triggers onSelect when view details button is clicked", () => {
    const handleSelect = vi.fn();
    render(<SpotCard spot={sampleSpot} onSelect={handleSelect} />);
    const btn = screen.getByRole("button", { name: /View Rates & Details/i });
    fireEvent.click(btn);
    expect(handleSelect).toHaveBeenCalledWith("spot-123");
  });
});
