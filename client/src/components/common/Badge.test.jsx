import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Badge from "./Badge";

describe("Badge Component", () => {
  it("renders children correctly", () => {
    render(<Badge>PAID</Badge>);
    expect(screen.getByText("PAID")).toBeInTheDocument();
  });

  it("applies correct variant styling", () => {
    render(<Badge variant="success">Active</Badge>);
    const badge = screen.getByText("Active");
    expect(badge).toHaveClass("bg-green-100");
  });
});
