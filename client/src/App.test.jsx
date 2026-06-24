import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import App from "./App";

vi.mock("./services/api", () => ({
  getDashboardData: vi.fn(() =>
    Promise.resolve({
      kpis: {
        availability_rate: 99.85,
        business_per_branch: "₹42.5 Cr",
        capacity_utilization: 78.2,
        casa_ratio: 38.4,
      },
      products: [
        {
          id: "p1",
          name: "Savings Max",
          category: "Savings",
          aum_contribution: 120,
          npa_percentage: null,
          status: "MAINTAIN",
        },
      ],
      scenarios: [
        {
          id: "balanced",
          name: "Balanced",
          description:
            "Promote Rural Agri-Saver & Gold Loans; Reduce Premium FD; Swap Personal Loans to low-risk variants.",
          casa_growth: 4.5,
          npa_risk: "Medium",
          roa_impact: 0.35,
          guardrails: {
            kyc_aml_flags: true,
            min_casa_floor: true,
            pmla_2002_screening: true,
            rbi_exposure_norms: true,
          },
          product_actions: [{ product_id: "p1", action: "MAINTAIN" }],
        },
      ],
    }),
  ),
  submitProposal: vi.fn(() =>
    Promise.resolve({
      id: "prop1",
      scenario_id: "balanced",
      status: "SUBMITTED",
      submitted_by: "Sarah Jenkins",
      routed_to: "John Doe (Zonal Head)",
      timestamp: "2026-06-24T12:45:00Z",
      guardrails_passed: true,
      audit_trail:
        "Proposal submitted by Sarah Jenkins to Zonal Head (John Doe). Scenario: Balanced. Guardrails status: passed. Timestamp: 2026-06-24T12:45:00Z. Audit ID: TXN-98421-RURAL",
    }),
  ),
}));

describe("App Smoke Test", () => {
  it("renders the sidebar and header", async () => {
    render(<App />);

    // Check sidebar brand
    expect(screen.getByText("Apex Retail Bank")).toBeInTheDocument();

    // Check header title
    expect(
      screen.getByText("Semi-Urban & Rural Cluster Decision-Support"),
    ).toBeInTheDocument();

    // Wait for dashboard data to load
    await waitFor(() => {
      expect(screen.getByText("Business per Branch")).toBeInTheDocument();
    });

    // Check KPI values
    expect(screen.getByText("₹42.5 Cr")).toBeInTheDocument();
    expect(screen.getByText("38.4%")).toBeInTheDocument();

    // Check product table
    expect(screen.getByText("Savings Max")).toBeInTheDocument();
  });
});
