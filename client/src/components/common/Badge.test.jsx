import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge Component", () => {
  it("renders children correctly", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies correct variant classes", () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    expect(container.firstChild).toHaveClass("bg-emerald-100");
    expect(container.firstChild).toHaveClass("text-emerald-800");
  });
});
