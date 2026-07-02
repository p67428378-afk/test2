import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PlanGrid from "./PlanGrid";

describe("PlanGrid Component", () => {
  it("renders popular plans and triggers callback on selection", () => {
    const handleSelectPlan = vi.fn();
    render(<PlanGrid onSelectPlan={handleSelectPlan} />);

    // Check if popular plans are rendered
    expect(screen.getByText("Popular Recharge Plans")).toBeInTheDocument();
    expect(screen.getByText("₹199")).toBeInTheDocument();
    expect(screen.getByText("₹2999")).toBeInTheDocument();

    // Click on a plan
    const planCard = screen.getByText("₹199").closest("div");
    fireEvent.click(planCard);

    expect(handleSelectPlan).toHaveBeenCalledWith(199);
  });
});
