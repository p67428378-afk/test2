import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import * as api from "./services/api";

// Mock the API services
vi.mock("./services/api", () => ({
  getKpis: vi.fn(),
  getProducts: vi.fn(),
  getScenarios: vi.fn(),
  createApprovalRequest: vi.fn(),
}));

describe("Retail Banking Product Strategy App", () => {
  const mockKpis = {
    business_per_branch: 150.0,
    capacity_utilization: 85.0,
    casa_ratio: 42.0,
    product_availability: 99.8,
  };

  const mockProducts = [
    {
      id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      name: "Savings Premium",
      category: "Deposit",
      aum_contribution: 25.0,
      npa_percentage: 0.0,
      status: "GROW",
    },
  ];

  const mockScenarios = [
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Balanced",
      casa_growth_projection: 5.0,
      npa_risk_projection: "Moderate",
      roa_impact_projection: 0.35,
      product_actions: [{ action: "Promote", product_name: "Savings Premium" }],
      guardrails: {
        kyc_aml_flags: "PASS",
        minimum_casa_floor: "PASS",
        pmla_2002_screening: "PASS",
        rbi_exposure_norms: "PASS",
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getKpis.mockResolvedValue(mockKpis);
    api.getProducts.mockResolvedValue(mockProducts);
    api.getScenarios.mockResolvedValue(mockScenarios);
  });

  it("renders the dashboard with loading state initially", async () => {
    render(<App />);
    expect(
      screen.getByText(
        /Retail Banking Product Strategy Decision-Support Tool/i,
      ),
    ).toBeInTheDocument();
  });

  it("loads and displays KPI and product data", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("₹150 Cr")).toBeInTheDocument();
      expect(screen.getAllByText("Savings Premium").length).toBeGreaterThan(0);
      expect(
        screen.getByText("Balanced Scenario Selected"),
      ).toBeInTheDocument();
    });
  });

  it("submits approval request successfully", async () => {
    api.createApprovalRequest.mockResolvedValue({
      id: "req-123",
      scenario_id: "22222222-2222-2222-2222-222222222222",
      user_id: "PM-001",
      submission_timestamp: new Date().toISOString(),
      status: "SUBMITTED",
      audit_trail: {
        id: "audit-123",
        approved_by: "Sarah Chen",
        guardrails_passed: ["RBI Exposure Limits", "KYC / AML Compliant"],
        timestamp: new Date().toISOString(),
      },
    });

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("Submit for Regional Approval"),
      ).toBeInTheDocument();
    });

    const submitBtn = screen.getByText("Submit for Regional Approval");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Scenario Submitted Successfully"),
      ).toBeInTheDocument();
      expect(screen.getAllByText("Sarah Chen").length).toBeGreaterThan(0);
    });
  });
});
