import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import StatsBar from "./StatsBar.jsx";

describe("StatsBar Component", () => {
  it("renders total, completed, and pending counts correctly", () => {
    render(<StatsBar total={10} completed={6} pending={4} />);

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
