import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KPIGrid from "./KPIGrid";

describe("KPIGrid Component", () => {
  it("renders summary values correctly", () => {
    const mockSummary = {
      is_roundup_enabled: true,
      today_invested_amount: 4.25,
      total_roundup_amount: 342.5,
    };

    render(<KPIGrid summary={mockSummary} />);
    expect(screen.getByText("$12,450.80")).toBeInTheDocument();
    expect(screen.getByTestId("total-roundups")).toHaveTextContent("$342.50");
    expect(screen.getByText("ENABLED")).toBeInTheDocument();
  });

  it("renders disabled status correctly", () => {
    const mockSummary = {
      is_roundup_enabled: false,
      today_invested_amount: 0,
      total_roundup_amount: 12.5,
    };

    render(<KPIGrid summary={mockSummary} />);
    expect(screen.getByText("DISABLED")).toBeInTheDocument();
  });
});
