// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import TipCalculatorDetailedSplitBreakdownView from "./TipCalculatorDetailedSplitBreakdownView.jsx";

describe("TipCalculatorDetailedSplitBreakdownView Page", () => {
  it("renders page with breakdown table and summary", () => {
    render(
      <BrowserRouter>
        <TipCalculatorDetailedSplitBreakdownView />
      </BrowserRouter>,
    );

    expect(screen.getByText("SPLI&TIP")).toBeInTheDocument();
    expect(
      screen.getByText("Detailed Bill Split Breakdown"),
    ).toBeInTheDocument();
    expect(screen.getByText("Calculation Summary")).toBeInTheDocument();
  });
});
