import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import KPIHeaderStrip from "./KPIHeaderStrip.jsx";

describe("KPIHeaderStrip Component", () => {
  it("renders loading state correctly", () => {
    const { container } = render(<KPIHeaderStrip loading={true} />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    render(<KPIHeaderStrip error="Network Error" />);
    expect(screen.getByText("Failed to load KPIs")).toBeInTheDocument();
    expect(screen.getByText("Network Error")).toBeInTheDocument();
  });

  it("renders KPI values correctly when data is provided", () => {
    const mockKPIs = {
      sales_per_linear_ft: 25.5,
      private_brand_percentage: 32.1,
      in_stock_rate: 98.4,
      shelf_capacity: 78.5,
    };
    render(<KPIHeaderStrip kpis={mockKPIs} loading={false} />);
    expect(screen.getByText("$25.50")).toBeInTheDocument();
    expect(screen.getByText("32.1%")).toBeInTheDocument();
    expect(screen.getByText("98.4%")).toBeInTheDocument();
    expect(screen.getByText("78.5%")).toBeInTheDocument();
  });
});
