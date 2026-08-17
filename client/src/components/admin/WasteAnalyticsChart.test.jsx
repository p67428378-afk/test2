import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WasteAnalyticsChart from "./WasteAnalyticsChart";

describe("WasteAnalyticsChart Component", () => {
  const mockAnalytics = {
    total_rescued_kg: 250,
    total_claims_count: 18,
    active_routes: 4,
    successful_deliveries_count: 14,
  };

  it("renders analytics KPI numbers correctly", () => {
    render(<WasteAnalyticsChart analytics={mockAnalytics} />);

    expect(screen.getByText(/Total Rescued/i)).toBeInTheDocument();
    expect(screen.getByText("250 kg")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });
});
