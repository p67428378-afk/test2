import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API services to avoid real network calls during tests
vi.mock("./services/api.js", () => ({
  getKPIs: vi.fn().mockResolvedValue({
    in_stock_rate: 96.8,
    private_brand_pct: 24.2,
    sales_per_linear_ft: 1245.5,
    shelf_capacity: 88.5,
  }),
  getSKUPerformance: vi.fn().mockResolvedValue({
    items: [
      {
        days_of_supply: 14,
        id: "dec-8f03-4dc0-ac2d-5fac0d960c6a",
        profit_margin: 34.5,
        sku_name: "Clover Valley Potato Chips 10oz",
        status: "GROW",
        stock_level: 1200,
        upc: "012200001234",
        weekly_sales: 4250,
      },
    ],
    limit: 10,
    page: 1,
    total: 1,
  }),
  getScenarioProjections: vi.fn().mockResolvedValue({
    action_counts: {
      grow: 12,
      maintain: 24,
      reduce: 4,
      swap: 8,
    },
    guardrails: {
      margin_target_passed: true,
      private_brand_passed: true,
      space_capacity_passed: true,
    },
    projected_private_brand_pct: 25,
    projected_sales_lift: 5,
    projected_shelf_capacity: 98,
    scenario_type: "balanced",
  }),
  submitAssortmentDecision: vi.fn().mockResolvedValue({
    audit_id: "dec-8f03-4dc0-ac2d-5fac0d960c6a",
    submitted_at: "2026-01-09T11:50:00Z",
    success: true,
    summary: "Success! Assortment plan for Small Town Value Cluster submitted.",
  }),
}));

describe("DG Cluster Assortment Advisor App", () => {
  it("renders the main dashboard layout and header", async () => {
    render(<App />);

    // Check if the main title is rendered
    const titleElement = screen.getByText(/Cluster Assortment Advisor/i);
    expect(titleElement).toBeInTheDocument();

    // Check if the user name is rendered
    const userElement = screen.getByText(/Sarah Chen/i);
    expect(userElement).toBeInTheDocument();
  });

  it("renders the KPI header strip section", async () => {
    render(<App />);

    // Check if KPI titles are rendered
    expect(screen.getByText(/Sales per Linear Ft/i)).toBeInTheDocument();
    expect(screen.getByText(/Private Brand %/i)).toBeInTheDocument();
    expect(screen.getByText(/In-Stock Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Shelf Capacity/i)).toBeInTheDocument();
  });

  it("renders the Scenario Selector section", async () => {
    render(<App />);

    // Check if Scenario Selector title is rendered
    expect(screen.getByText(/Scenario Selector/i)).toBeInTheDocument();

    // Check if scenario options are rendered
    expect(screen.getByText(/Conservative/i)).toBeInTheDocument();
    expect(screen.getByText(/Balanced/i)).toBeInTheDocument();
    expect(screen.getByText(/Aggressive/i)).toBeInTheDocument();
  });

  it("renders the Approval Review section", async () => {
    render(<App />);

    // Check if Approval Review title is rendered
    expect(screen.getByText(/Approval Review/i)).toBeInTheDocument();

    // Check if submit button is rendered
    const submitButton = screen.getByRole("button", {
      name: /Submit Assortment Changes/i,
    });
    expect(submitButton).toBeInTheDocument();
  });
});
