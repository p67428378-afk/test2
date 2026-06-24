import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KPIHeaderStrip from "./KPIHeaderStrip";

describe("KPIHeaderStrip", () => {
  const mockKpis = {
    business_per_branch: "₹1.2 Cr",
    casa_ratio: 42.5,
    scheme_availability_rate: 99.8,
    capacity_utilization: 85,
  };

  it("renders loading state correctly", () => {
    render(<KPIHeaderStrip kpis={null} loading={true} />);
    expect(screen.getByTestId("kpi-loading")).toBeInTheDocument();
  });

  it("renders KPI values correctly when loaded", () => {
    render(<KPIHeaderStrip kpis={mockKpis} loading={false} />);
    expect(screen.getByText("₹1.2 Cr")).toBeInTheDocument();
    expect(screen.getByText("42.5%")).toBeInTheDocument();
    expect(screen.getByText("99.8%")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });
});
