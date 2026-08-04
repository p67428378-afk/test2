import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock axios / assortmentService API calls if needed
vi.mock("./services/api.js", () => ({
  default: {
    get: vi.fn().mockImplementation((url) => {
      if (url.includes("/navigation/tabs")) {
        return Promise.resolve({
          data: {
            sidebar_tabs: [
              {
                id: "overview",
                label: "Overview",
                icon: "dashboard",
                active: true,
              },
              {
                id: "category_strategy",
                label: "Category Strategy",
                icon: "strategy",
                active: true,
              },
              {
                id: "sku_performance",
                label: "SKU Performance",
                icon: "analytics",
                active: true,
              },
              {
                id: "store_clusters",
                label: "Store Clusters",
                icon: "group_work",
                active: true,
              },
              {
                id: "audit_history",
                label: "Audit History",
                icon: "history",
                active: true,
              },
            ],
            topnav_tabs: [
              {
                id: "assortment_advisor",
                label: "Assortment Advisor",
                active: true,
              },
              {
                id: "scenario_modeler",
                label: "Scenario Modeler",
                active: true,
              },
              { id: "guardrail_rules", label: "Guardrail Rules", active: true },
              { id: "approval_queue", label: "Approval Queue", active: true },
            ],
          },
        });
      }
      if (url.includes("/kpis")) {
        return Promise.resolve({
          data: {
            sales_per_linear_ft: 142.5,
            private_brand_mix_pct: 28.5,
            in_stock_rate_pct: 96.2,
            shelf_capacity_utilization_pct: 94.0,
          },
        });
      }
      if (url.includes("/skus")) {
        return Promise.resolve({
          data: {
            total_skus: 2,
            skus: [
              {
                sku_id: "SKU-1001",
                sku_code: "1029481",
                product_name: "Lay's Classic Family Size",
                brand: "National",
                sub_category: "Salty Snacks",
                sales_volume_weekly: 1245.0,
                margin_pct: 24.5,
                linear_space_ft: 2.0,
                is_private_brand: false,
                status_badge: "GROW",
              },
              {
                sku_id: "SKU-1002",
                sku_code: "1029555",
                product_name: "DG Clover Valley Chips",
                brand: "DG Brand",
                sub_category: "Salty Snacks",
                sales_volume_weekly: 890.5,
                margin_pct: 42.1,
                linear_space_ft: 1.0,
                is_private_brand: true,
                status_badge: "GROW",
              },
            ],
          },
        });
      }
      if (url.includes("/scenarios")) {
        return Promise.resolve({
          data: {
            cluster_id: "STV-CLUSTER-01",
            default_scenario: "Balanced",
            scenarios: [
              {
                scenario_id: "SCEN-01",
                name: "Conservative",
                projected_sales_lift_pct: 1.2,
                projected_private_brand_pct: 27.2,
                shelf_capacity_impact_pct: 91.5,
                action_summary: { GROW: 2, MAINTAIN: 12, SWAP: 1, REDUCE: 2 },
              },
              {
                scenario_id: "SCEN-02",
                name: "Balanced",
                projected_sales_lift_pct: 3.5,
                projected_private_brand_pct: 28.5,
                shelf_capacity_impact_pct: 94.0,
                action_summary: { GROW: 4, MAINTAIN: 85, SWAP: 3, REDUCE: 2 },
              },
            ],
          },
        });
      }
      if (url.includes("/guardrails")) {
        return Promise.resolve({
          data: [
            {
              id: "rule-1",
              rule_name: "Private Brand % Threshold",
              metric_key: "private_brand_mix_pct",
              operator: ">=",
              threshold_value: 25.0,
              is_mandatory: true,
            },
          ],
        });
      }
      return Promise.resolve({ data: {} });
    }),
    post: vi.fn().mockImplementation((url, body) => {
      return Promise.resolve({
        data: {
          submission_id: "SUB-123456",
          audit_ref_id: "AUD-994821",
          scenario_name: body.scenario_name || "Balanced",
          status: "APPROVED_AND_LOGGED",
          skus_modified_count: 17,
          timestamp_utc: "2026-05-18T14:32:00Z",
        },
      });
    }),
  },
  assortmentService: {
    getNavigationTabs: vi.fn().mockResolvedValue({
      sidebar_tabs: [
        { id: "overview", label: "Overview", icon: "dashboard", active: true },
        {
          id: "category_strategy",
          label: "Category Strategy",
          icon: "strategy",
          active: true,
        },
        {
          id: "sku_performance",
          label: "SKU Performance",
          icon: "analytics",
          active: true,
        },
        {
          id: "store_clusters",
          label: "Store Clusters",
          icon: "group_work",
          active: true,
        },
        {
          id: "audit_history",
          label: "Audit History",
          icon: "history",
          active: true,
        },
      ],
      topnav_tabs: [
        { id: "assortment_advisor", label: "Assortment Advisor", active: true },
        { id: "scenario_modeler", label: "Scenario Modeler", active: true },
        { id: "guardrail_rules", label: "Guardrail Rules", active: true },
        { id: "approval_queue", label: "Approval Queue", active: true },
      ],
    }),
    getKPIs: vi.fn().mockResolvedValue({
      sales_per_linear_ft: 142.5,
      private_brand_mix_pct: 28.5,
      in_stock_rate_pct: 96.2,
      shelf_capacity_utilization_pct: 94.0,
    }),
    getSKUs: vi.fn().mockResolvedValue({
      total_skus: 2,
      skus: [
        {
          sku_id: "SKU-1001",
          sku_code: "1029481",
          product_name: "Lay's Classic Family Size",
          brand: "National",
          sub_category: "Salty Snacks",
          sales_volume_weekly: 1245.0,
          margin_pct: 24.5,
          linear_space_ft: 2.0,
          is_private_brand: false,
          status_badge: "GROW",
        },
      ],
    }),
    getScenarios: vi.fn().mockResolvedValue({
      cluster_id: "STV-CLUSTER-01",
      default_scenario: "Balanced",
      scenarios: [
        {
          scenario_id: "SCEN-01",
          name: "Conservative",
          projected_sales_lift_pct: 1.2,
          projected_private_brand_pct: 27.2,
          shelf_capacity_impact_pct: 91.5,
          action_summary: { GROW: 2, MAINTAIN: 12, SWAP: 1, REDUCE: 2 },
        },
        {
          scenario_id: "SCEN-02",
          name: "Balanced",
          projected_sales_lift_pct: 3.5,
          projected_private_brand_pct: 28.5,
          shelf_capacity_impact_pct: 94.0,
          action_summary: { GROW: 4, MAINTAIN: 85, SWAP: 3, REDUCE: 2 },
        },
      ],
    }),
    getGuardrails: vi.fn().mockResolvedValue([
      {
        id: "rule-1",
        rule_name: "Private Brand % Threshold",
        metric_key: "private_brand_mix_pct",
        operator: ">=",
        threshold_value: 25.0,
        is_mandatory: true,
      },
    ]),
    submitScenario: vi.fn().mockResolvedValue({
      submission_id: "SUB-123456",
      audit_ref_id: "AUD-994821",
      scenario_name: "Balanced",
      status: "APPROVED_AND_LOGGED",
      skus_modified_count: 17,
      timestamp_utc: "2026-05-18T14:32:00Z",
    }),
  },
}));

describe("App Dashboard Multi-Tab Navigation", () => {
  it("renders without crashing and displays header title", async () => {
    render(<App />);
    const brandTitles = screen.getAllByText(/Dollar General/i);
    expect(brandTitles.length).toBeGreaterThan(0);
  });

  it("allows switching top navigation tabs to Guardrail Rules", async () => {
    render(<App />);
    const guardrailTabs = screen.getAllByText(/Guardrail Rules/i);
    expect(guardrailTabs.length).toBeGreaterThan(0);

    fireEvent.click(guardrailTabs[0]);

    await waitFor(() => {
      expect(
        screen.getByText(/Category Guardrail Rules & Policy Constraints/i),
      ).toBeInTheDocument();
    });
  });

  it("allows switching sidebar navigation tabs to Overview", async () => {
    render(<App />);
    const overviewTabs = screen.getAllByText(/Overview/i);
    expect(overviewTabs.length).toBeGreaterThan(0);

    fireEvent.click(overviewTabs[0]);

    await waitFor(() => {
      expect(
        screen.getByText(/Cluster Assortment Health Overview/i),
      ).toBeInTheDocument();
    });
  });

  it("allows submitting scenario recommendation", async () => {
    render(<App />);
    const submitBtn = screen.getByRole("button", {
      name: /Submit Recommendation/i,
    });
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Assortment Recommendation Approved & Logged/i),
      ).toBeInTheDocument();
    });
  });
});
