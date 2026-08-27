// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import CalculationSummaryCard from "./CalculationSummaryCard.jsx";

describe("CalculationSummaryCard Component", () => {
  const mockResults = {
    tip_per_person: 9.0,
    total_per_person: 69.0,
    total_tip: 18.0,
    total_bill: 138.0,
  };

  it("renders calculation statistics correctly", () => {
    render(
      <BrowserRouter>
        <CalculationSummaryCard
          results={mockResults}
          billAmount={120}
          tipPercentage={15}
          numPeople={2}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText("Calculation Summary")).toBeInTheDocument();
    expect(screen.getByTestId("tip-per-person")).toHaveTextContent("$9.00");
    expect(screen.getByTestId("total-per-person")).toHaveTextContent("$69.00");
    expect(screen.getByTestId("total-tip")).toHaveTextContent("$18.00");
    expect(screen.getByTestId("total-bill")).toHaveTextContent("$138.00");
    expect(screen.getByText("Exact Split")).toBeInTheDocument();
    expect(screen.getByText("Includes Tip")).toBeInTheDocument();
  });
});
