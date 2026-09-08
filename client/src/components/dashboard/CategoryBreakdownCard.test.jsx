import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CategoryBreakdownCard from "./CategoryBreakdownCard";

describe("CategoryBreakdownCard Component", () => {
  const sampleBreakdown = [
    { category: "Food & Dining", amount: 450.0, percentage: 53.0 },
    { category: "Housing & Utilities", amount: 300.0, percentage: 35.0 },
  ];

  it("renders empty state when breakdown list is empty", () => {
    render(
      <CategoryBreakdownCard categoryBreakdown={[]} selectedMonth="2026-05" />,
    );
    expect(
      screen.getByText("No expense breakdown available for this timeframe."),
    ).toBeInTheDocument();
  });

  it("renders category list with amounts and percentages", () => {
    render(
      <CategoryBreakdownCard
        categoryBreakdown={sampleBreakdown}
        selectedMonth="2026-05"
      />,
    );

    expect(screen.getByText("Food & Dining")).toBeInTheDocument();
    expect(screen.getByText("$450.00 (53.0%)")).toBeInTheDocument();
    expect(screen.getByText("Housing & Utilities")).toBeInTheDocument();
    expect(screen.getByText("$300.00 (35.0%)")).toBeInTheDocument();
  });
});
