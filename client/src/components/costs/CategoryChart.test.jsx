import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CategoryChart from "./CategoryChart";

describe("CategoryChart Component", () => {
  const sampleBreakdown = [
    {
      category_id: "cat-1",
      category_name: "HVAC",
      estimated: 150,
      actual: 120,
      variance: -30,
    },
  ];

  it("renders chart title and data container without throwing", () => {
    render(<CategoryChart categoryBreakdown={sampleBreakdown} />);
    expect(
      screen.getByText("Expenses by Category (Estimated vs Actual)"),
    ).toBeInTheDocument();
  });

  it("renders fallback message when no data is provided", () => {
    render(<CategoryChart categoryBreakdown={[]} />);
    expect(
      screen.getByText("No cost breakdown data available."),
    ).toBeInTheDocument();
  });
});
