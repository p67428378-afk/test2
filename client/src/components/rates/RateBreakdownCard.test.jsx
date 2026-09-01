import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RateBreakdownCard from "./RateBreakdownCard";

describe("RateBreakdownCard Component", () => {
  const sampleRates = {
    base_hourly_rate: 5.0,
    current_active_rate: 5.0,
    is_peak: false,
    max_daily_cap: 25.0,
    rate_breakdown: {
      standard_rate: "$5.00/hr",
      peak_rate: "$7.50/hr",
      weekend_rate: "$5.00/hr",
    },
  };

  it("renders rate breakdown values correctly", () => {
    render(
      <RateBreakdownCard
        ratesData={sampleRates}
        spotId="spot-123"
        spotName="Central Lot"
      />,
    );
    expect(screen.getByText("Hourly Rate Structure")).toBeInTheDocument();
    expect(screen.getByText("Max Daily Cap")).toBeInTheDocument();
    expect(screen.getByText(/24-hour maximum charge/i)).toBeInTheDocument();
  });
});
