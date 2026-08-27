// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DetailedSplitBreakdownTable from "./DetailedSplitBreakdownTable.jsx";

describe("DetailedSplitBreakdownTable Component", () => {
  it("renders table rows for the specified number of people", () => {
    render(
      <DetailedSplitBreakdownTable
        billAmount={120}
        tipPercentage={15}
        numPeople={2}
      />,
    );

    expect(
      screen.getByText("Detailed Bill Split Breakdown"),
    ).toBeInTheDocument();
    expect(screen.getByText("Person 1 (Host)")).toBeInTheDocument();
    expect(screen.getByText("Person 2 (Guest)")).toBeInTheDocument();
    expect(screen.getAllByText("$60.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("$9.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("$69.00").length).toBeGreaterThanOrEqual(2);
  });

  it("toggles payment status on button click", () => {
    render(
      <DetailedSplitBreakdownTable
        billAmount={100}
        tipPercentage={20}
        numPeople={1}
      />,
    );

    const paidBtn = screen.getByRole("button", { name: "Paid" });
    fireEvent.click(paidBtn);
    expect(screen.getByRole("button", { name: "Pending" })).toBeInTheDocument();
  });
});
