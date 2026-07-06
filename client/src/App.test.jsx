import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Smoke Test", () => {
  it("renders sidebar and header", () => {
    render(<App />);
    expect(screen.getAllByText("VoltMonitor")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Alex Rivera")[0]).toBeInTheDocument();
  });
});
