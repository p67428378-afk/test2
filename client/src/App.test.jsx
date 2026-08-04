// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./services/api.js", () => {
  return {
    fetchKPIs: vi.fn().mockResolvedValue({
      cluster_id: "small-town-value",
      sales_per_linear_ft: 245.5,
      private_brand_share_pct: 28.5,
      instock_rate_pct: 96.2,
      shelf_capacity_utilization_pct: 92.0,
      last_updated: "2026-08-05T00:00:00Z",
    }),
    fetchSKUs: vi.fn().mockResolvedValue({
      total_count: 4,
      skus: [
        {
          sku_id: "SKU-9901",
          name: "Lays Classic 10oz",
          category: "Snacks",
          sub_category: "Chips",
          velocity_units_per_wk: 45,
          margin_pct: 18.0,
          linear_ft_space: 1.2,
          is_private_brand: false,
          status_badge: "MAINTAIN",
        },
      ],
    }),
    fetchScenarios: vi.fn().mockResolvedValue({
      default_selected: "balanced",
      scenarios: [
        {
          id: "balanced",
          label: "Balanced",
          projected_sales_delta_pct: 4.5,
          projected_pb_share_pct: 28.5,
          shelf_capacity_impact_pct: 1.2,
        },
      ],
    }),
    submitRecommendation: vi.fn().mockResolvedValue({
      status: "APPROVED_AND_LOGGED",
      audit_reference_id: "AUD-2026-8891",
      timestamp: "2026-08-05T00:00:00Z",
      submitted_by: "Aarchi Jain",
      scenario: "Balanced",
      summary: {
        grow_count: 1,
        maintain_count: 1,
        swap_count: 0,
        reduce_count: 0,
        guardrails_satisfied: true,
      },
    }),
    authService: {
      getCurrentUser: vi.fn().mockResolvedValue({
        id: "1",
        full_name: "Aarchi Jain",
        role: "Category Manager",
      }),
      login: vi.fn(),
      logout: vi.fn(),
    },
  };
});

describe("App Component - DG Assortment Advisor", () => {
  it("renders the Assortment Advisor dashboard shell and sidebar navigation tabs", async () => {
    render(<App />);

    expect(screen.getByText("Assortment Advisor")).toBeInTheDocument();
    expect(screen.getAllByText("Overview")[0]).toBeInTheDocument();
    expect(screen.getAllByText("SKU View")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Cluster Select")[0]).toBeInTheDocument();
  });

  it("switches view reactively when a left sidebar navigation tab is clicked", async () => {
    render(<App />);

    const skuTab = screen.getAllByText("SKU View")[0];
    fireEvent.click(skuTab);

    expect(
      await screen.findByText("SKU Performance Analytics"),
    ).toBeInTheDocument();

    const clusterTab = screen.getAllByText("Cluster Select")[0];
    fireEvent.click(clusterTab);

    expect(
      await screen.findByText("Cluster Selection & Store Configuration"),
    ).toBeInTheDocument();
  });
});
