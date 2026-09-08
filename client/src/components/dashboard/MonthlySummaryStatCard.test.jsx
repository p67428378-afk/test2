import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MonthlySummaryStatCard from "./MonthlySummaryStatCard";

describe("MonthlySummaryStatCard Component", () => {
  it("renders monthly total correctly", () => {
    render(
      <MonthlySummaryStatCard
        monthlyTotal={850.5}
        selectedMonth="2026-05"
        totalExpenses={3420.5}
      />,
    );

    expect(screen.getByText("May 2026 Total Spending")).toBeInTheDocument();
    expect(screen.getByText("$850.50")).toBeInTheDocument();
    expect(screen.getByText("$3420.50")).toBeInTheDocument();
  });

  it("renders default $0.00 when monthlyTotal is 0 or undefined", () => {
    render(<MonthlySummaryStatCard monthlyTotal={0} selectedMonth="" />);
    expect(screen.getByText("All Months Total Spending")).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
