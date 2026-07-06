import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import * as api from "./services/api";

// Mock the API service
vi.mock("./services/api", () => ({
  getKPIs: vi.fn(),
  getSKUs: vi.fn(),
  calculateScenario: vi.fn(),
  submitApproval: vi.fn(),
}));

describe("DG Cluster Assortment Advisor App Smoke Tests", () => {
  const mockKPIs = {
    sales_per_linear_ft: { value: 425.5, trend_yoy: 4.2 },
    private_brand_pct: { value: 28.4, target: 30.0 },
    in_stock_rate: { value: 96.2, status: "Healthy" },
    shelf_capacity_pct: { value: 92.1, remaining_ft: 9.2 },
  };

  const mockSKUs = [
    {
      sku_id: "SKU-1042",
      name: "Lay's Classic Potato Chips 13oz",
      current_sales: 14250,
      sales_trend_yoy: 8.5,
      profit_margin: 32,
      in_stock_rate: 98.1,
      recommendation: "GROW",
    },
    {
      sku_id: "SKU-3091",
      name: "Clover Valley Tortilla Chips 16oz",
      current_sales: 11800,
      sales_trend_yoy: 12.1,
      profit_margin: 45,
      in_stock_rate: 95.4,
      recommendation: "GROW",
    },
  ];

  const mockScenarioBalanced = {
    scenario_type: "Balanced",
    projected_sales_lift: 4.2,
    projected_private_brand_pct: 31.5,
    projected_shelf_capacity_pct: 96.0,
    sku_actions: [
      "Add CV Extreme Cheddar",
      "Swap Doritos with CV Ranch",
      "Reduce CV Cheese Crackers space",
    ],
    guardrails: {
      private_brand_check: {
        message: "Private Brand ≥ 30% (Proj: 31.5%)",
        passed: true,
      },
      capacity_check: {
        message: "Capacity ≤ 100% (Proj: 96.0%)",
        passed: true,
      },
      swap_limit_check: { message: "Swap Limit ≤ 3 (Actual: 1)", passed: true },
    },
  };

  const mockApprovalResponse = {
    success: true,
    audit_trail_id: "TXN-98421-STV",
    submitted_by: "Category Manager",
    sku_changes_summary: "1 Added, 1 Swapped, 1 Reduced.",
    timestamp: "2026-01-09T11:50:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.getKPIs.mockResolvedValue(mockKPIs);
    api.getSKUs.mockResolvedValue(mockSKUs);
    api.calculateScenario.mockResolvedValue(mockScenarioBalanced);
    api.submitApproval.mockResolvedValue(mockApprovalResponse);
  });

  it("renders the dashboard with header, table, and modeling sections", async () => {
    render(<App />);

    // Verify header title
    expect(
      await screen.findByText("DG Cluster Assortment Advisor"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Small Town Value Cluster — Snacks Category"),
    ).toBeInTheDocument();

    // Verify KPI cards
    expect(screen.getByText("Sales per Linear Ft")).toBeInTheDocument();
    expect(screen.getByText("$425.50")).toBeInTheDocument();
    expect(screen.getByText("Private Brand %")).toBeInTheDocument();
    expect(screen.getByText("28.4%")).toBeInTheDocument();

    // Verify SKU table renders items
    expect(
      screen.getByText("Lay's Classic Potato Chips 13oz"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Clover Valley Tortilla Chips 16oz"),
    ).toBeInTheDocument();

    // Verify Scenario Selector
    expect(
      screen.getByText("Assortment Scenario Modeling"),
    ).toBeInTheDocument();
    expect(screen.getByText("Conservative")).toBeInTheDocument();
    expect(screen.getByText("Balanced")).toBeInTheDocument();
    expect(screen.getByText("Aggressive")).toBeInTheDocument();
  });

  it("allows selecting a different scenario and submitting the plan", async () => {
    render(<App />);

    // Wait for initial load
    expect(
      await screen.findByText("DG Cluster Assortment Advisor"),
    ).toBeInTheDocument();

    // Find and click the Conservative scenario card
    const conservativeCard = screen.getByText("Conservative");
    fireEvent.click(conservativeCard);

    // Verify calculateScenario was called with 'Conservative'
    await waitFor(() => {
      expect(api.calculateScenario).toHaveBeenCalledWith("Conservative");
    });

    // Find and click the Submit button
    const submitButton = screen.getByRole("button", {
      name: /Submit Assortment Plan/i,
    });
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);

    // Verify submitApproval was called
    await waitFor(() => {
      expect(api.submitApproval).toHaveBeenCalled();
    });

    // Verify success banner is displayed
    expect(
      await screen.findByText("Assortment Plan Submitted Successfully!"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Audit Trail ID: TXN-98421-STV/i).textContent,
    ).toContain("Category Manager");
  });
});
