import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AdminAnalyticsKPIs from "./AdminAnalyticsKPIs";

describe("AdminAnalyticsKPIs Component", () => {
  it("renders analytics KPI metrics correctly", () => {
    const mockData = {
      total_active_bookings: 12,
      fleet_utilization_rate: 75.5,
      avg_fulfillment_duration_mins: 28.4,
      total_volume_liters: 45000,
      demand_surge_zone: "North Zone",
    };

    render(<AdminAnalyticsKPIs data={mockData} />);
    expect(screen.getByText(/Total Active Bookings/i)).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getAllByText(/75\.5/)[0]).toBeInTheDocument();
    expect(screen.getByText("North Zone")).toBeInTheDocument();
  });

  it("renders clean empty state visualization when metrics are zero", () => {
    render(<AdminAnalyticsKPIs data={null} />);
    expect(screen.getByText(/Zero Completed Deliveries/i)).toBeInTheDocument();
  });
});
