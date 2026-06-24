import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the API services
vi.mock("./services/api", () => ({
  getDashboardData: vi.fn(() =>
    Promise.resolve({
      kpi_metrics: {
        sales_per_linear_ft: 450.5,
        private_brand_percent: 24.5,
        in_stock_rate: 96.2,
        shelf_capacity: 1200,
      },
      scenarios: [
        {
          name: "Balanced",
          projected_impact: {
            sales_per_linear_ft: 485.5,
            private_brand_percent: 28.2,
            in_stock_rate: 96.5,
            shelf_capacity: 1200,
          },
          guardrails: {
            private_brand_target_passed: true,
            sales_target_passed: true,
            shelf_capacity_passed: true,
          },
          sku_actions: [{ sku: "SKU-1001", action: "GROW" }],
        },
      ],
      sku_performance: [
        {
          id: "d3b07384-d113-49c3-a55e-4c3d163e4501",
          sku: "SKU-1001",
          name: "Clover Valley Potato Chips 10oz",
          private_brand_percent: 100,
          sales_per_linear_ft: 520,
          in_stock_rate: 98.5,
          shelf_capacity: 150,
          status: "GROW",
        },
      ],
    }),
  ),
  submitAssortmentPlan: vi.fn(() =>
    Promise.resolve({
      audit_trail_id: "e4b07384-d113-49c3-a55e-4c3d163e4502",
      scenario_name: "Balanced",
      sku_actions_count: 1,
      status: "SUCCESS",
      submitted_at: "2026-01-09T12:00:00Z",
      submitted_by: "category_manager@dollargeneral.com",
    }),
  ),
}));

describe("DG Cluster Assortment Advisor App", () => {
  it("renders the dashboard with key elements", async () => {
    render(<App />);

    // Wait for loading state to resolve
    await waitFor(() => {
      expect(
        screen.queryByText("Loading Assortment Advisor..."),
      ).not.toBeInTheDocument();
    });

    // Check for main header
    const headers = screen.getAllByText("Assortment Advisor");
    expect(headers.length).toBeGreaterThan(0);

    // Check for KPI cards
    expect(screen.getByText("Sales per Linear Ft")).toBeInTheDocument();
    expect(screen.getByText("Private Brand %")).toBeInTheDocument();
    expect(screen.getByText("In-Stock Rate")).toBeInTheDocument();
    expect(screen.getByText("Shelf Capacity")).toBeInTheDocument();

    // Check for SKU Performance table
    expect(screen.getByText("SKU Performance")).toBeInTheDocument();
    expect(
      screen.getByText("Clover Valley Potato Chips 10oz"),
    ).toBeInTheDocument();

    // Check for Scenario Selection
    expect(screen.getByText("Scenario Selection")).toBeInTheDocument();

    // Check for Approval Summary
    expect(screen.getByText("Approval Summary")).toBeInTheDocument();
  });

  it("allows submitting the assortment plan and shows confirmation modal", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.queryByText("Loading Assortment Advisor..."),
      ).not.toBeInTheDocument();
    });

    // Click submit button
    const submitButton = screen.getByRole("button", {
      name: /Submit Assortment Plan/i,
    });
    fireEvent.click(submitButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(
        screen.getByText("Assortment Plan Submitted Successfully"),
      ).toBeInTheDocument();
    });

    // Check audit trail details
    expect(screen.getByText("Audit Trail Summary")).toBeInTheDocument();
    expect(
      screen.getByText("e4b07384-d113-49c3-a55e-4c3d163e4502"),
    ).toBeInTheDocument();
  });
});
