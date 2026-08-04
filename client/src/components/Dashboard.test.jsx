import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import Dashboard from "./Dashboard";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  fetchKPIs: vi.fn(),
  fetchSKUs: vi.fn(),
  fetchScenarios: vi.fn(),
  submitRecommendation: vi.fn(),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    api.fetchKPIs.mockResolvedValue({
      cluster_id: "small-town-value",
      sales_per_linear_ft: 245.5,
      private_brand_share_pct: 28.5,
      instock_rate_pct: 96.2,
      shelf_capacity_utilization_pct: 92.0,
      last_updated: "2026-08-04T00:00:00Z",
    });

    api.fetchSKUs.mockResolvedValue({
      total_count: 2,
      skus: [
        {
          sku_id: "SKU-SNACK-1001",
          name: "DG Crave Potato Chips 10oz",
          category: "Potato Chips",
          velocity_units_per_wk: 42.0,
          margin_pct: 34.0,
          linear_ft_space: 1.2,
          is_private_brand: true,
          status_badge: "GROW",
        },
        {
          sku_id: "SKU-SNACK-1002",
          name: "Clover Valley Mini Pretzels 16oz",
          category: "Pretzels",
          velocity_units_per_wk: 31.5,
          margin_pct: 38.0,
          linear_ft_space: 1.0,
          is_private_brand: true,
          status_badge: "MAINTAIN",
        },
      ],
    });

    api.fetchScenarios.mockResolvedValue({
      default_selected: "balanced",
      scenarios: [
        {
          id: "conservative",
          label: "Conservative",
          projected_sales_delta_pct: 2.1,
          projected_pb_share_pct: 26.0,
          shelf_capacity_impact_pct: 90.0,
        },
        {
          id: "balanced",
          label: "Balanced",
          projected_sales_delta_pct: 5.2,
          projected_pb_share_pct: 28.5,
          shelf_capacity_impact_pct: 92.0,
        },
        {
          id: "aggressive",
          label: "Aggressive",
          projected_sales_delta_pct: 8.4,
          projected_pb_share_pct: 32.0,
          shelf_capacity_impact_pct: 95.0,
        },
      ],
    });

    api.submitRecommendation.mockResolvedValue({
      status: "APPROVED",
      audit_reference_id: "AUD-2026-8891",
      timestamp: "2026-08-04T16:20:00Z",
      submitted_by: "Aarchi Jain",
      scenario: "balanced",
      summary: {
        grow_count: 12,
        maintain_count: 8,
        swap_count: 3,
        reduce_count: 2,
        guardrails_satisfied: true,
      },
    });
  });

  it("renders dashboard title and main navigation", async () => {
    render(<Dashboard />);

    expect(screen.getByText("Snacks Category Assortment")).toBeInTheDocument();
    expect(screen.getByText("Assortment Advisor")).toBeInTheDocument();
  });

  it("displays KPI cards with fetched data", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("$245.50/ft")).toBeInTheDocument();
      expect(screen.getByText("28.5%")).toBeInTheDocument();
      expect(screen.getByText("96.2%")).toBeInTheDocument();
    });
  });

  it("renders scenario selector cards and updates active scenario on click", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Conservative")).toBeInTheDocument();
      expect(screen.getByText("Balanced")).toBeInTheDocument();
      expect(screen.getByText("Aggressive")).toBeInTheDocument();
    });

    const aggressiveCard = screen.getByText("Aggressive");
    fireEvent.click(aggressiveCard);

    expect(screen.getByText("Aggressive Strategy Summary")).toBeInTheDocument();
  });

  it("handles submit recommendation and displays inline audit modal", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("DG Crave Potato Chips 10oz"),
      ).toBeInTheDocument();
    });

    const submitButtons = screen.getAllByText(
      /Submit Assortment Recommendation/i,
    );
    expect(submitButtons.length).toBeGreaterThan(0);
    fireEvent.click(submitButtons[0]);

    await waitFor(() => {
      expect(api.submitRecommendation).toHaveBeenCalledWith({
        cluster_id: "small-town-value",
        scenario_id: "balanced",
        manager_id: "Aarchi Jain",
        notes:
          "Submitted Balanced scenario recommendation for Snacks category.",
      });
      expect(screen.getByText(/AUD-2026-8891/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Assortment Recommendation Submitted/i),
      ).toBeInTheDocument();
    });
  });
});
