import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App.jsx";
import * as api from "./services/api.js";

// Mock the API services
vi.mock("./services/api.js", () => ({
  getKPIs: vi.fn(),
  getScenario: vi.fn(),
  submitAssortmentDecision: vi.fn(),
}));

describe("DG Cluster Assortment Advisor App", () => {
  const mockKPIs = {
    sales_per_linear_ft: 145.5,
    private_brand_pct: 22.4,
    in_stock_rate: 94.5,
    shelf_capacity_pct: 88.2,
  };

  const mockScenario = {
    scenario_name: "balanced",
    projected_sales_impact_pct: 4.2,
    projected_private_brand_pct: 23.5,
    projected_shelf_capacity_pct: 91.0,
    action_counts: {
      grow: 5,
      maintain: 12,
      reduce: 2,
      swap: 3,
    },
    guardrails: {
      new_items_passed: true,
      private_brand_passed: true,
      shelf_capacity_passed: true,
    },
    skus: [
      {
        sku_name: "Lay's Classic Potato Chips 13oz",
        upc: "028400310413",
        weekly_sales: 1250,
        profit_margin: 28.5,
        stock_level: 150,
        days_of_supply: 12,
        status: "MAINTAIN",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.getKPIs.mockResolvedValue(mockKPIs);
    api.getScenario.mockResolvedValue(mockScenario);
  });

  it("renders loading state initially", () => {
    render(<App />);
    expect(
      screen.getByText(/Loading Cluster Assortment Advisor/i),
    ).toBeInTheDocument();
  });

  it("renders dashboard with KPIs and SKU table after loading", async () => {
    render(<App />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(
        screen.queryByText(/Loading Cluster Assortment Advisor/i),
      ).not.toBeInTheDocument();
    });

    // Verify TopNavBar elements
    expect(screen.getByText("Cluster Assortment Advisor")).toBeInTheDocument();
    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();

    // Verify KPI cards
    expect(screen.getByText("Sales per Linear Ft")).toBeInTheDocument();
    expect(screen.getByText("$145.50")).toBeInTheDocument();
    expect(screen.getByText("22.4%")).toBeInTheDocument();
    expect(screen.getByText("94.5%")).toBeInTheDocument();
    expect(screen.getByText("88.2%")).toBeInTheDocument();

    // Verify SKU table
    expect(
      screen.getByText("Lay's Classic Potato Chips 13oz"),
    ).toBeInTheDocument();
    expect(screen.getByText("028400310413")).toBeInTheDocument();
    expect(screen.getByText("$1,250")).toBeInTheDocument();
    expect(screen.getByText("28.5%")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("12 days")).toBeInTheDocument();
  });

  it("allows searching SKUs", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search SKUs or UPC...");
    fireEvent.change(searchInput, { target: { value: "Lays" } });

    expect(searchInput.value).toBe("Lays");
  });

  it("allows selecting a different scenario", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    const conservativeCard = screen.getByText("Conservative");
    fireEvent.click(conservativeCard);

    expect(api.getScenario).toHaveBeenCalledWith(
      "conservative",
      expect.any(Object),
    );
  });
});
