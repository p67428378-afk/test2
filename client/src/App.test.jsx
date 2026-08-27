// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./services/api.js", () => ({
  tipCalculatorService: {
    calculateTip: vi.fn().mockResolvedValue({
      total_tip: 18.0,
      total_bill: 138.0,
      tip_per_person: 9.0,
      total_per_person: 69.0,
    }),
  },
  default: {
    interceptors: {
      request: { use: vi.fn() },
    },
  },
}));

describe("App Component", () => {
  it("renders the Tip Calculator main view by default", () => {
    render(<App />);
    expect(screen.getByText("SPLI&TIP")).toBeInTheDocument();
    expect(screen.getByText("Bill & Tip Input")).toBeInTheDocument();
    expect(screen.getByText("Calculation Summary")).toBeInTheDocument();
  });
});
