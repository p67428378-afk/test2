import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ClassificationDashboard from "./ClassificationDashboard";

describe("ClassificationDashboard Component", () => {
  it("renders dashboard headings, toolbar and metrics cards", () => {
    render(<ClassificationDashboard onSwitchToStudio={vi.fn()} />);

    expect(
      screen.getByText("Email Classification Review Dashboard"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total Processed")).toBeInTheDocument();
    expect(screen.getByText("Work & Operations")).toBeInTheDocument();
    expect(screen.getByText("Urgent Priority")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /Search by subject, sender, or content keyword/i,
      ),
    ).toBeInTheDocument();
  });
});
