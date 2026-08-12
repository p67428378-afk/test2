import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DriverItineraryMap from "./DriverItineraryMap";

describe("DriverItineraryMap Component", () => {
  it("renders driver itinerary header and zones", () => {
    render(<DriverItineraryMap routes={[]} driverId="DRV-101" />);
    expect(
      screen.getByText("Optimized Driver Route Itinerary"),
    ).toBeInTheDocument();
    expect(screen.getByText("DRV-101")).toBeInTheDocument();
  });

  it("renders assigned routes list", () => {
    const mockRoutes = [
      {
        id: "r1",
        driver_id: "DRV-101",
        zone: "Zone 1",
        sequence_order: 1,
        order_id: "ord-101-uuid",
        stop_type: "PICKUP",
        stop_status: "EN_ROUTE",
      },
    ];

    render(<DriverItineraryMap routes={mockRoutes} driverId="DRV-101" />);
    expect(screen.getByText("PICKUP - Order #ord-101-")).toBeInTheDocument();
  });
});
