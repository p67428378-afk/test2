import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LiveTrackingTimeline from "./LiveTrackingTimeline";

describe("LiveTrackingTimeline Component", () => {
  it("renders fallback when no order is passed", () => {
    render(<LiveTrackingTimeline order={null} />);
    expect(
      screen.getByText("No order selected for live tracking."),
    ).toBeInTheDocument();
  });

  it("renders stages for active order", () => {
    const mockOrder = {
      id: "12345678-uuid",
      status: "Washing",
      service_type: "Wash & Fold",
      stages: [
        { id: "1", stage: "Received", timestamp: "2026-08-12T12:00:00Z" },
        { id: "2", stage: "Washing", timestamp: "2026-08-12T13:00:00Z" },
      ],
    };

    render(<LiveTrackingTimeline order={mockOrder} />);
    expect(screen.getByText("Order #12345678")).toBeInTheDocument();
    expect(screen.getAllByText("Washing").length).toBeGreaterThan(0);
  });
});
