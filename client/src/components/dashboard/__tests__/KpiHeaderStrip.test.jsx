import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KpiHeaderStrip from "../KpiHeaderStrip";

describe("KpiHeaderStrip", () => {
  it("renders loading state correctly", () => {
    render(<KpiHeaderStrip kpis={null} loading={true} />);
    // Skeletons should be rendered
    const skeletons = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("animate-pulse"));
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders KPI values correctly when loaded", () => {
    const mockKpis = {
      sales_per_linear_ft: 15.75,
      private_brand_percentage: 22.5,
      in_stock_rate: 96.2,
      shelf_capacity: 88.0,
    };

    render(<KpiHeaderStrip kpis={mockKpis} loading={false} />);

    expect(screen.getByText("$15.75")).toBeInTheDocument();
    expect(screen.getByText("22.5%")).toBeInTheDocument();
    expect(screen.getByText("96.2%")).toBeInTheDocument();
    expect(screen.getByText("88.0%")).toBeInTheDocument();
  });
});
