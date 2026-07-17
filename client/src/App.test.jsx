import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App.jsx";
import * as api from "./services/api.js";

// Mock the API service
vi.mock("./services/api.js", () => ({
  getKPIs: vi.fn(),
  getSKUs: vi.fn(),
  calculateScenario: vi.fn(),
  submitAssortmentReview: vi.fn(),
}));

describe("DG Cluster Assortment Advisor App", () => {
  const mockKPIs = {
    sales_per_linear_ft: 15.75,
    private_brand_percentage: 22.5,
    in_stock_rate: 98.2,
    shelf_capacity: 85.0,
  };

  const mockSKUs = [
    {
      id: "1",
      name: "Clover Valley Potato Chips 10oz",
      sales: 12450,
      profit_margin: 34.2,
      units_sold: 4120,
      status: "GROW",
    },
    {
      id: "2",
      name: "Clover Valley Tortilla Chips 12oz",
      sales: 9820,
      profit_margin: 31.5,
      units_sold: 3240,
      status: "MAINTAIN",
    },
  ];

  const mockCalculation = {
    scenario_name: "Balanced",
    projected_sales_lift: 4.5,
    projected_margin_lift: 3.2,
    guardrails: [
      {
        name: "Private Brand % remains above 20%",
        status: "PASSED",
        message: "Private Brand % remains above 20%",
      },
      {
        name: "Shelf Capacity remains below 90%",
        status: "PASSED",
        message: "Shelf Capacity remains below 90%",
      },
    ],
    sku_actions: [
      {
        sku_id: "1",
        sku_name: "Clover Valley Potato Chips 10oz",
        action: "GROW",
      },
      {
        sku_id: "2",
        sku_name: "Clover Valley Tortilla Chips 12oz",
        action: "MAINTAIN",
      },
    ],
  };

  const mockSubmitResponse = {
    id: "review-123",
    scenario_name: "Balanced",
    status: "SUBMITTED",
    submitted_by: "test@example.com",
    created_at: "2026-07-17T12:00:00Z",
    audit_trail_summary: {
      submission_id: "audit-999",
      timestamp: "2026-07-17T12:00:00Z",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.getKPIs.mockResolvedValue(mockKPIs);
    api.getSKUs.mockResolvedValue(mockSKUs);
    api.calculateScenario.mockResolvedValue(mockCalculation);
    api.submitAssortmentReview.mockResolvedValue(mockSubmitResponse);
  });

  it("renders the dashboard layout and fetches initial data", async () => {
    render(<App />);

    // Verify layout elements
    expect(screen.getByText("Advisor Pro")).toBeInTheDocument();
    expect(
      screen.getByText("DG Cluster Assortment Advisor"),
    ).toBeInTheDocument();

    // Wait for KPIs to load
    await waitFor(() => {
      expect(screen.getByText("$15.75")).toBeInTheDocument();
      expect(screen.getByText("22.5%")).toBeInTheDocument();
    });

    // Wait for SKUs to load
    await waitFor(() => {
      expect(
        screen.getByText("Clover Valley Potato Chips 10oz"),
      ).toBeInTheDocument();
    });

    // Wait for Scenario Review to load
    await waitFor(() => {
      expect(screen.getByText("Scenario Review: Balanced")).toBeInTheDocument();
    });
  });

  it("allows changing scenarios and submitting for approval", async () => {
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Scenario Review: Balanced")).toBeInTheDocument();
    });

    // Click Conservative scenario
    const conservativeBtn = screen.getByText("Conservative");
    fireEvent.click(conservativeBtn);

    // Verify calculateScenario was called with Conservative
    await waitFor(() => {
      expect(api.calculateScenario).toHaveBeenCalledWith("Conservative");
    });

    // Click Submit for Approval
    const submitBtn = screen.getByRole("button", {
      name: /Submit for Approval/i,
    });
    fireEvent.click(submitBtn);

    // Verify submitAssortmentReview was called
    await waitFor(() => {
      expect(api.submitAssortmentReview).toHaveBeenCalled();
    });

    // Verify modal is shown with audit trail details
    await waitFor(() => {
      expect(screen.getByText("Submission Successful")).toBeInTheDocument();
      expect(screen.getByText("audit-999")).toBeInTheDocument();
    });
  });
});
