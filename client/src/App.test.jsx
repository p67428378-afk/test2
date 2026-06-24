import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import * as api from "./services/api";

// Mock the API service
vi.mock("./services/api", () => ({
  getDashboardData: vi.fn(),
  submitProposal: vi.fn(),
}));

const mockDashboardData = {
  kpis: {
    business_per_branch: "₹42.5 Cr",
    capacity_utilization: 78.2,
    casa_ratio: 38.4,
    product_availability_rate: 99.85,
  },
  products: [
    {
      id: "p1",
      name: "Regular Savings",
      category: "Deposit",
      aum_contribution: 120.0,
      npa_percentage: null,
      status: "MAINTAIN",
    },
    {
      id: "p2",
      name: "Super Saver",
      category: "Deposit",
      aum_contribution: 85.0,
      npa_percentage: null,
      status: "GROW",
    },
    {
      id: "p3",
      name: "Gold Loan",
      category: "Loan",
      aum_contribution: 45.0,
      npa_percentage: 0.85,
      status: "GROW",
    },
  ],
  scenarios: [
    {
      id: "conservative",
      name: "Conservative",
      description:
        "Focus on deposit retention and minimizing high-risk asset exposure.",
      casa_growth: 1.5,
      npa_risk: "Low",
      roa_impact: 0.1,
      guardrails: {
        kyc_aml_flags: true,
        min_casa_floor: true,
        pmla_2002_screening: true,
        rbi_exposure_norms: true,
      },
      product_actions: [
        { product_id: "p1", action: "MAINTAIN" },
        { product_id: "p2", action: "MAINTAIN" },
      ],
    },
    {
      id: "balanced",
      name: "Balanced",
      description:
        "Optimized growth in secure lending while aggressively expanding CASA deposits.",
      casa_growth: 4.2,
      npa_risk: "-0.15%",
      roa_impact: 0.35,
      guardrails: {
        kyc_aml_flags: true,
        min_casa_floor: true,
        pmla_2002_screening: true,
        rbi_exposure_norms: true,
      },
      product_actions: [
        { product_id: "p1", action: "MAINTAIN" },
        { product_id: "p2", action: "GROW" },
        { product_id: "p3", action: "GROW" },
      ],
    },
  ],
};

describe("ApexBank Decision-Support Dashboard", () => {
  it("renders loading state initially", () => {
    vi.mocked(api.getDashboardData).mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(
      screen.getByText(/Loading decision-support dashboard.../i),
    ).toBeInTheDocument();
  });

  it("renders dashboard with KPIs, products, and scenarios after loading", async () => {
    vi.mocked(api.getDashboardData).mockResolvedValue(mockDashboardData);
    render(<App />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(
        screen.queryByText(/Loading decision-support dashboard.../i),
      ).not.toBeInTheDocument();
    });

    // Verify Brand Header
    expect(screen.getByText("ApexBank")).toBeInTheDocument();

    // Verify KPIs
    expect(screen.getByText("₹42.5 Cr")).toBeInTheDocument();
    expect(screen.getByText("38.4%")).toBeInTheDocument();
    expect(screen.getByText("99.85%")).toBeInTheDocument();
    expect(screen.getByText("78.2%")).toBeInTheDocument();

    // Verify Products
    expect(screen.getByText("Regular Savings")).toBeInTheDocument();
    expect(screen.getByText("Super Saver")).toBeInTheDocument();
    expect(screen.getByText("Gold Loan")).toBeInTheDocument();

    // Verify Scenarios
    expect(screen.getByText("Conservative")).toBeInTheDocument();
    expect(screen.getByText("Balanced")).toBeInTheDocument();
  });

  it("allows switching scenarios and submitting proposal", async () => {
    vi.mocked(api.getDashboardData).mockResolvedValue(mockDashboardData);
    vi.mocked(api.submitProposal).mockResolvedValue({
      id: "prop-123",
      scenario_id: "balanced",
      status: "SUBMITTED",
      submitted_by: "Sarah Jenkins",
      routed_to: "John Doe (Zonal Head)",
      timestamp: "2026-01-09T12:00:00Z",
      guardrails_passed: true,
      audit_trail:
        "Proposal submitted by Sarah Jenkins to Zonal Head (John Doe). Scenario: Balanced. Guardrails status: passed. Timestamp: 2026-01-09T12:00:00Z. Audit ID: TXN-ABCDE-RURAL",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    // Click on Conservative scenario card
    const conservativeCard = screen.getByText("Conservative");
    fireEvent.click(conservativeCard);

    // Click on Balanced scenario card
    const balancedCard = screen.getByText("Balanced");
    fireEvent.click(balancedCard);

    // Click Submit Proposal button
    const submitButton = screen.getByRole("button", {
      name: /Submit Proposal to Regional Head/i,
    });
    fireEvent.click(submitButton);

    // Verify success banner appears
    await waitFor(() => {
      expect(
        screen.getByText("Proposal Submitted Successfully"),
      ).toBeInTheDocument();
      expect(screen.getByText("Sarah Jenkins")).toBeInTheDocument();
      expect(screen.getByText("John Doe (Zonal Head)")).toBeInTheDocument();
    });
  });
});
