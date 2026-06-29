import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ApprovalReviewPanel from "../ApprovalReviewPanel";

describe("ApprovalReviewPanel", () => {
  const mockScenarioData = {
    scenario_name: "Balanced",
    projected_metrics: {
      in_stock_rate: 97.1,
      private_brand_percentage: 23.8,
      sales_per_linear_ft: 16.4,
      shelf_capacity: 89.0,
    },
    guardrail_checks: {
      all_passed: true,
      private_brand_passed: true,
      shelf_capacity_passed: true,
      sku_count_change_passed: true,
    },
    sku_action_summary: {
      grow: 5,
      maintain: 32,
      reduce: 3,
      swap: 2,
    },
  };

  it("renders loading state", () => {
    render(
      <ApprovalReviewPanel
        scenarioData={null}
        onSubmit={vi.fn()}
        submitting={false}
        loading={true}
      />,
    );
    // Skeletons should be rendered
    const skeletons = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("animate-pulse"));
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders scenario summary and guardrails correctly", () => {
    render(
      <ApprovalReviewPanel
        scenarioData={mockScenarioData}
        onSubmit={vi.fn()}
        submitting={false}
        loading={false}
      />,
    );

    expect(screen.getByText("Balanced Scenario Summary")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // Grow count
    expect(screen.getByText("3")).toBeInTheDocument(); // Reduce count
    expect(screen.getByText("2")).toBeInTheDocument(); // Swap count

    expect(screen.getByText("PB% >= 20%")).toBeInTheDocument();
    expect(screen.getByText("23.8%")).toBeInTheDocument();
  });

  it("calls onSubmit when submit button is clicked", () => {
    const handleSubmit = vi.fn();
    render(
      <ApprovalReviewPanel
        scenarioData={mockScenarioData}
        onSubmit={handleSubmit}
        submitting={false}
        loading={false}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Submit Assortment Plan/i }),
    );
    expect(handleSubmit).toHaveBeenCalled();
  });
});
