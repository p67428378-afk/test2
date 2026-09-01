import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MapViewport from "./MapViewport";

describe("MapViewport Component", () => {
  const sampleSpots = [
    {
      spot_id: "s1",
      name: "Central Garage",
      address: "456 Market St",
      hourly_rate: 5.0,
      status: "AVAILABLE",
      available_spots: 10,
    },
  ];

  it("renders spatial map viewport with pins", () => {
    render(<MapViewport spots={sampleSpots} selectedSpotId="s1" />);
    expect(screen.getByText("Interactive Spatial Map")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();
  });
});
