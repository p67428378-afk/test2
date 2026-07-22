import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the API service
vi.mock("./services/api", () => ({
  getKPIs: vi.fn().mockResolvedValue({
    sales_per_linear_ft: 152.5,
    private_brand_percentage: 18.75,
    in_stock_rate: 94.2,
    shelf_capacity_utilized: 88.0,
  }),
  getSKUs: vi.fn().mockResolvedValue([
    {
      id: "1",
      sku_name: "Lay's Classic 13oz",
      upc: "028400040112",
      sales_rank_percentile: 95,
      weekly_sales: 12000,
      margin_percentage: 35.5,
      is_private_brand: false,
      status: "GROW",
    },
    {
      id: "2",
      sku_name: "Clover Valley Potato Chips",
      upc: "012345678901",
      sales_rank_percentile: 75,
      weekly_sales: 8500,
      margin_percentage: 42.0,
      is_private_brand: true,
      status: "GROW",
    },
  ]),
  getScenarioProjection: vi.fn().mockResolvedValue({
    scenario_name: "balanced",
    projected_private_brand_percentage: 19.5,
    projected_total_sales: 510000,
    guardrails: [
      { name: "Projected Private Brand % > 15%", pass: true },
      { name: "Shelf Capacity < 95%", pass: true },
    ],
    actions: {
      add: [{ sku_id: "2", sku_name: "Clover Valley Potato Chips" }],
      reduce: [],
      swap: [],
    },
  }),
  submitAssortmentPlan: vi.fn().mockResolvedValue({
    audit_trail_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    status: "SUBMITTED",
    submitted_at: "2026-01-01T12:00:00Z",
  }),
}));

describe("DG Cluster Assortment Advisor Dashboard", () => {
  it("renders the dashboard header and main sections", async () => {
    render(<App />);

    // Check header title
    expect(
      screen.getByText("DG Cluster Assortment Advisor"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Small Town Value Cluster - Snacks Category"),
    ).toBeInTheDocument();

    // Check KPI cards are rendered
    await waitFor(() => {
      expect(screen.getByText("Sales per Linear Ft")).toBeInTheDocument();
      expect(screen.getByText("Private Brand %")).toBeInTheDocument();
      expect(screen.getByText("In-Stock Rate")).toBeInTheDocument();
      expect(screen.getByText("Shelf Capacity")).toBeInTheDocument();
    });
  });

  it("allows selecting a different scenario", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Scenario Modeling")).toBeInTheDocument();
    });

    const conservativeCard = screen.getByText("Conservative");
    expect(conservativeCard).toBeInTheDocument();

    fireEvent.click(conservativeCard);
    // Selection state updates
    expect(conservativeCard.closest(".cursor-pointer")).toHaveClass(
      "scenario-card-active",
    );
  });

  it("submits the assortment plan and shows confirmation modal", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Submit Assortment Plan")).toBeInTheDocument();
    });

    const submitBtn = screen.getByText("Submit Assortment Plan");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Assortment Plan Submitted")).toBeInTheDocument();
      expect(screen.getByText("SUBMITTED")).toBeInTheDocument();
    });
  });
});
