import { render, screen } from "@testing-library/react";
import React from "react";
import { expect, test, vi } from "vitest";
import App from "./App.jsx";

// Mock API calls
vi.mock("./services/api.js", () => ({
  getKPIs: vi.fn(() =>
    Promise.resolve({
      in_stock_rate: 95.0,
      private_brand_pct: 22.0,
      sales_per_linear_ft: 1250.0,
      shelf_capacity: 85.0,
    }),
  ),
  getSKUPerformance: vi.fn(() =>
    Promise.resolve({
      items: [
        {
          sku: "SKU-1001",
          product_name: "Clover Valley Pretzels",
          sales: 1250.0,
          profit_margin: 35.0,
          days_of_supply: 15,
          status_badge: "GROW",
          trend_direction: "Up",
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    }),
  ),
  getScenarioProjections: vi.fn((type) =>
    Promise.resolve({
      scenario_type: type,
      projected_sales_lift:
        type === "Conservative" ? 0.5 : type === "Balanced" ? 2.0 : 4.5,
      projected_private_brand_pct:
        type === "Conservative" ? 23.0 : type === "Balanced" ? 25.0 : 28.0,
      holiday_lift_pct: type === "Aggressive" ? 12.5 : null,
      guardrails: { private_brand_mix_ok: true, shelf_capacity_ok: true },
      sku_actions: { add: 5, keep: 92, remove: 3 },
    }),
  ),
  submitAssortmentDecision: vi.fn(() =>
    Promise.resolve({
      success: true,
      audit_id: "AUDIT-123",
      submitted_at: "2026-07-01T16:00:00Z",
      summary: "Balanced Scenario: +25% Private Brand, +2% Sales",
    }),
  ),
}));

test("renders App and displays main title", async () => {
  render(<App />);
  const titleElement = await screen.findByText(/Cluster Assortment Advisor/i);
  expect(titleElement).toBeInTheDocument();
});
