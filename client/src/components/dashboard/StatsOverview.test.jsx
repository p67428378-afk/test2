import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatsOverview from "./StatsOverview";

describe("StatsOverview Component", () => {
  it("renders stats correctly", () => {
    const stats = {
      total_tasks: 10,
      completed_tasks: 5,
      in_progress_tasks: 3,
      overdue_tasks: 2,
      completion_rate: 50.0,
    };

    render(<StatsOverview stats={stats} />);

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("50.0%")).toBeInTheDocument();
  });

  it("handles empty stats gracefully", () => {
    render(<StatsOverview stats={null} />);
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("0.0%")).toBeInTheDocument();
  });
});
