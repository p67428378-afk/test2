import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import * as api from "./services/api";

// Mock the API service
vi.mock("./services/api", () => ({
  getKPIs: vi.fn(),
  getSKUs: vi.fn(),
  getScenarios: vi.fn(),
  submitPlan: vi.fn(),
}));

describe("DG Cluster Assortment Advisor App Smoke Tests", () => {
  const mockKPIs = {
    sales_per_linear_ft: 15.75,
    private_brand_pct: 22.0,
    in_stock_rate: 98.2,
    shelf_capacity: 85.0,
    sales_trend_pct: 4.2,
    private_brand_target: 25.0,
    in_stock_target: 95.0,
    shelf_capacity_range_min: 80.0,
    shelf_capacity_range_max: 90.0,
  };

  const mockSKUs = {
    items: [
      {
        sku: "48291",
        name: "Clover Valley Potato Chips 10oz",
        sales_ytd: 14250.0,
        units: 5700,
        gm_pct: 42.1,
        recommendation: "GROW",
        is_private_brand: true,
      },
    ],
    total: 1,
    skip: 0,
    limit: 5,
  };

  const mockScenarios = [
    {
      id: "conservative",
      name: "Conservative",
      description: "Minimize disruption, low risk swaps.",
      private_brand_pct: 23.5,
      projected_sales_pct: 1.2,
      swaps_count: 2,
      guardrails: {
        gm_pct_impact: "Passed",
        private_brand_share: "Warning",
        shelf_space_limits: "Passed",
      },
    },
    {
      id: "balanced",
      name: "Balanced",
      description: "Moderate shift towards Private Brand targets.",
      private_brand_pct: 25.2,
      projected_sales_pct: 3.5,
      swaps_count: 5,
      guardrails: {
        gm_pct_impact: "Passed",
        private_brand_share: "Passed",
        shelf_space_limits: "Passed",
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getKPIs.mockResolvedValue(mockKPIs);
    api.getSKUs.mockResolvedValue(mockSKUs);
    api.getScenarios.mockResolvedValue(mockScenarios);
  });

  it("renders the dashboard with header, KPIs, and scenario selector", async () => {
    render(<App />);

    // Verify TopNavBar elements
    expect(screen.getByText("Cluster Assortment Advisor")).toBeInTheDocument();

    // Wait for KPIs to load and render
    await waitFor(() => {
      expect(screen.getByText("$15.75")).toBeInTheDocument();
    });
    expect(screen.getByText("22.0%")).toBeInTheDocument();
    expect(screen.getByText("98.2%")).toBeInTheDocument();

    // Verify Scenario Selector renders
    expect(screen.getByText("Scenario Selector")).toBeInTheDocument();
    expect(screen.getByText("Conservative")).toBeInTheDocument();
    expect(screen.getByText("Balanced")).toBeInTheDocument();
  });

  it("submits the assortment plan successfully and displays confirmation banner", async () => {
    api.submitPlan.mockResolvedValue({
      success: true,
      audit_id: "AP-541-TEST",
      scenario: "balanced",
      manager_name: "Sarah Jenkins",
      submitted_at: "2026-07-17T10:27:04.326Z",
    });

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Balanced")).toBeInTheDocument();
    });

    // Find and click submit button
    const submitButtons = screen.getAllByText("Submit Assortment Plan");
    fireEvent.click(submitButtons[0]);

    // Verify success banner appears
    await waitFor(() => {
      expect(
        screen.getByText(/Assortment plan submitted successfully!/i),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Audit ID: AP-541-TEST")).toBeInTheDocument();
  });
});
