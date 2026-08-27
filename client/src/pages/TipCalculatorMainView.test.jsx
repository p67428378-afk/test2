// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TipCalculatorMainView from "./TipCalculatorMainView.jsx";
import { tipCalculatorService } from "../services/api.js";

vi.mock("../services/api.js", () => ({
  tipCalculatorService: {
    calculateTip: vi.fn(),
  },
  default: {
    interceptors: {
      request: { use: vi.fn() },
    },
  },
}));

describe("TipCalculatorMainView Page", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders page with navbar and calculation cards", () => {
    render(
      <BrowserRouter>
        <TipCalculatorMainView />
      </BrowserRouter>,
    );

    expect(screen.getByText("SPLI&TIP")).toBeInTheDocument();
    expect(screen.getByText("Bill & Tip Input")).toBeInTheDocument();
    expect(screen.getByText("Calculation Summary")).toBeInTheDocument();
  });

  it("handles tip calculation successfully", async () => {
    tipCalculatorService.calculateTip.mockResolvedValueOnce({
      total_tip: 20.0,
      total_bill: 120.0,
      tip_per_person: 10.0,
      total_per_person: 60.0,
    });

    render(
      <BrowserRouter>
        <TipCalculatorMainView />
      </BrowserRouter>,
    );

    const calculateBtn = screen.getByRole("button", { name: /Calculate Tip/i });
    fireEvent.click(calculateBtn);

    await waitFor(() => {
      expect(tipCalculatorService.calculateTip).toHaveBeenCalled();
    });
  });
});
