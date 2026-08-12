import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Root Component", () => {
  it("renders application navigation and header", () => {
    render(<App />);
    expect(screen.getByText(/SpinCycle/i)).toBeInTheDocument();
    expect(screen.getByText("Customer Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Operator Portal")).toBeInTheDocument();
    expect(screen.getByText("Driver Route Portal")).toBeInTheDocument();
  });
});
