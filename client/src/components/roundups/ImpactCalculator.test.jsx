import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ImpactCalculator from "./ImpactCalculator";

describe("ImpactCalculator Component", () => {
  it("renders and calculates passive impact", () => {
    render(<ImpactCalculator />);
    expect(screen.getByText("Passive Impact Calculator")).toBeInTheDocument();

    // Default: 3 purchases * $0.45 * 30 days = $40.50
    expect(screen.getByTestId("calc-monthly")).toHaveTextContent("$40.50");
  });
});
