import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "./App.jsx";
import * as api from "./services/api.js";

// Mock the API service
vi.mock("./services/api.js", () => ({
  getKPIMetrics: vi.fn(),
  getSKUPerformance: vi.fn(),
  submitAssortmentPlan: vi.fn(),
}));

const mockKPIs = {
  sales_per_linear_ft: 185.5,
  private_brand_percentage: 24.5,
  in_stock_rate: 96.4,
  shelf_capacity_percentage: 88.2,
};

const mockSKUs = [
  {
    sku_id: "11111111-1111-1111-1111-111111111111",
    sku_number: "SKU-001",
    product_name: "Clover Valley Potato Chips",
    is_private_brand: true,
    sales: 1200.0,
    units: 600,
    margin_percentage: 35.0,
    scenarios: {
      Conservative: { action: "MAINTAIN" },
      Balanced: { action: "GROW" },
      Aggressive: { action: "GROW" },
    },
  },
  {
    sku_id: "22222222-2222-2222-2222-222222222222",
    sku_number: "SKU-002",
    product_name: "Lay's Classic Potato Chips",
    is_private_brand: false,
    sales: 2500.0,
    units: 1000,
    margin_percentage: 22.0,
    scenarios: {
      Conservative: { action: "REDUCE" },
      Balanced: { action: "MAINTAIN" },
      Aggressive: { action: "REDUCE" },
    },
  },
];

describe("DG Cluster Assortment Advisor Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getKPIMetrics.mockResolvedValue(mockKPIs);
    api.getSKUPerformance.mockResolvedValue(mockSKUs);
  });

  it("renders the dashboard with KPIs and SKU table", async () => {
    render(<App />);

    // Verify loading state initially or wait for load
    await waitFor(() => {
      expect(screen.getByText("Dollar General")).toBeInTheDocument();
    });

    // Check KPIs
    expect(screen.getByText("Sales per Linear Ft")).toBeInTheDocument();
    expect(screen.getByText("$185.50")).toBeInTheDocument();
    expect(screen.getByText("24.5%")).toBeInTheDocument();

    // Check SKU Table
    expect(screen.getByText("Clover Valley Potato Chips")).toBeInTheDocument();
    expect(screen.getByText("Lay's Classic Potato Chips")).toBeInTheDocument();
  });

  it("allows changing scenarios and updates SKU actions", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("Clover Valley Potato Chips"),
      ).toBeInTheDocument();
    });

    // Balanced is pre-selected. Clover Valley action should be GROW, Lay's should be MAINTAIN.
    // Let's select Conservative Plan
    const conservativeCard = screen.getByText("Conservative Plan");
    fireEvent.click(conservativeCard);

    // Verify scenario selection updates
    expect(screen.getByText("Active Scenario:")).toBeInTheDocument();
  });

  it("submits the assortment plan successfully", async () => {
    api.submitAssortmentPlan.mockResolvedValue({
      submission_id: "99999999-9999-9999-9999-999999999999",
      status: "SUCCESS",
      scenario_selected: "Balanced",
      actions_submitted_count: 2,
      manager_email: "manager@dollargeneral.com",
      timestamp: "2026-07-15T12:00:00Z",
      audit_trail_summary: "Assortment plan submitted successfully.",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Submit Assortment Plan")).toBeInTheDocument();
    });

    const submitBtn = screen.getByText("Submit Assortment Plan");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Submission Successful")).toBeInTheDocument();
      expect(
        screen.getByText("Assortment plan submitted successfully."),
      ).toBeInTheDocument();
    });
  });
});
