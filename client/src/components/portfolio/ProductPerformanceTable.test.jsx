import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductPerformanceTable from "./ProductPerformanceTable";

describe("ProductPerformanceTable", () => {
  const mockProducts = [
    {
      id: "1",
      name: "Savings Elite",
      aum_contribution: 450,
      npa_percentage: 0,
      status: "GROW",
    },
    {
      id: "2",
      name: "PL Express",
      aum_contribution: 65,
      npa_percentage: 4.2,
      status: "REDUCE",
    },
  ];

  it("renders loading state correctly", () => {
    render(<ProductPerformanceTable products={[]} loading={true} />);
    expect(screen.getAllByTestId("product-row-loading")).toHaveLength(6);
  });

  it("renders product rows correctly when loaded", () => {
    render(<ProductPerformanceTable products={mockProducts} loading={false} />);
    expect(screen.getByText("Savings Elite")).toBeInTheDocument();
    expect(screen.getByText("PL Express")).toBeInTheDocument();
    expect(screen.getByText("₹450 Cr")).toBeInTheDocument();
    expect(screen.getByText("₹65 Cr")).toBeInTheDocument();
    expect(screen.getByText("4.2%")).toBeInTheDocument();
  });
});
