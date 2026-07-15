import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ApprovalReviewPanel from "./ApprovalReviewPanel.jsx";

describe("ApprovalReviewPanel Component", () => {
  const mockScenarioData = {
    scenario_name: "Balanced",
    projected_sales_impact: 4.2,
    projected_private_brand: 29.5,
    guardrails: {
      private_brand_goal_met: true,
      shelf_capacity_within_limits: true,
    },
    sku_actions: [
      { sku: "Clover Valley Tortilla Chips", action: "ADD" },
      { sku: "Slow-Seller Cookies", action: "REMOVE" },
    ],
  };

  it("renders proposed actions and guardrails", () => {
    render(
      <ApprovalReviewPanel
        scenarioData={mockScenarioData}
        loading={false}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText("Plan Summary (Balanced)")).toBeInTheDocument();
    expect(screen.getByText("ADD:")).toBeInTheDocument();
    expect(
      screen.getByText("Clover Valley Tortilla Chips"),
    ).toBeInTheDocument();
    expect(screen.getByText("REMOVE:")).toBeInTheDocument();
    expect(screen.getByText("Slow-Seller Cookies")).toBeInTheDocument();
    expect(screen.getByText("MET")).toBeInTheDocument();
    expect(screen.getByText("WITHIN LIMITS")).toBeInTheDocument();
  });

  it("calls onSubmit when Submit button is clicked", () => {
    const handleSubmit = vi.fn();
    render(
      <ApprovalReviewPanel
        scenarioData={mockScenarioData}
        loading={false}
        onSubmit={handleSubmit}
      />,
    );
    const button = screen.getByRole("button", {
      name: /Submit Assortment Plan/i,
    });
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
