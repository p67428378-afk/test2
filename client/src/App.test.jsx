import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the API services
vi.mock("./services/api", () => ({
  getKPIs: vi.fn(() =>
    Promise.resolve({
      business_per_branch: 12500000.0,
      capacity_utilization: 78.2,
      casa_ratio: 42.5,
      scheme_availability: 99.8,
    }),
  ),
  getProducts: vi.fn(() =>
    Promise.resolve([
      {
        product_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        name: "Savings Account Variant A",
        category: "Savings",
        aum_contribution: 45000000.0,
        npa_percentage: 0.0,
        status: "GROW",
      },
      {
        product_id: "b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e",
        name: "Personal Loan Type C",
        category: "Loans",
        aum_contribution: 15000000.0,
        npa_percentage: 4.2,
        status: "REDUCE",
      },
    ]),
  ),
  getScenario: vi.fn((scenarioName) =>
    Promise.resolve({
      scenario_name: scenarioName,
      projections: {
        casa_growth: 2.5,
        npa_risk_movement: -0.4,
        roa_impact: 0.15,
      },
      guardrail_checks: {
        kyc_aml_flags: "PASSED",
        minimum_casa_floor: "PASSED",
        pmla_2002_screening: "PASSED",
        rbi_exposure_norms: "PASSED",
      },
      recommended_actions: [
        {
          product_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
          product_name: "Savings Account Variant A",
          action: "GROW",
        },
        {
          product_id: "b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e",
          product_name: "Personal Loan Type C",
          action: "REDUCE",
        },
      ],
    }),
  ),
  submitApproval: vi.fn(() =>
    Promise.resolve({
      status: "SUCCESS",
      audit_trail: {
        approved_by: "Product Manager Cluster A",
        guardrails_passed: {
          kyc_aml_flags: true,
          minimum_casa_floor: true,
          pmla_2002_screening: true,
          rbi_exposure_norms: true,
        },
        log_id: "f83920c1-2938-4d82-9283-1029384756af",
        scenario_name: "balanced",
        submission_timestamp: "2026-01-09T12:00:00Z",
      },
    }),
  ),
}));

describe("ApexBank Dashboard Smoke Test", () => {
  it("renders the dashboard layout and key elements", async () => {
    render(<App />);

    // Check brand name
    expect(screen.getByText("ApexBank")).toBeInTheDocument();

    // Check main header title
    expect(
      screen.getByText("Semi-Urban/Rural Branch Cluster Decision Support"),
    ).toBeInTheDocument();

    // Check test account banner
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();

    // Wait for products to load and render
    await waitFor(() => {
      expect(screen.getByText("Savings Account Variant A")).toBeInTheDocument();
    });

    // Check strategy model section
    expect(screen.getByText("Strategy Model")).toBeInTheDocument();

    // Check submit button
    expect(
      screen.getByRole("button", { name: /Submit Decision/i }),
    ).toBeInTheDocument();
  });

  it("allows switching scenarios and submitting decision", async () => {
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Savings Account Variant A")).toBeInTheDocument();
    });

    // Click on Conservative scenario card
    const conservativeCard = screen.getByText("Conservative");
    fireEvent.click(conservativeCard);

    // Click submit button
    const submitBtn = screen.getByRole("button", { name: /Submit Decision/i });
    fireEvent.click(submitBtn);

    // Wait for success banner to appear
    await waitFor(() => {
      expect(
        screen.getByText("Decision Submitted Successfully"),
      ).toBeInTheDocument();
    });

    // Check audit trail details
    expect(screen.getByText("Product Manager Cluster A")).toBeInTheDocument();
  });
});
