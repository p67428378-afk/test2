import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import DashboardPage from "../pages/DashboardPage.jsx";
import * as api from "../services/api.js";

// Mock the API module
vi.mock("../services/api.js", () => ({
  getPayments: vi.fn().mockResolvedValue([
    {
      payment_id: "12345678-1234-1234-1234-1234567890ab",
      beneficiary_name: "Siemens AG",
      currency: "EUR",
      amount: 1250000.0,
      status: "Settled",
      created_at: "2026-06-18T10:36:45.477793+00:00",
    },
  ]),
}));

describe("DashboardPage", () => {
  it("renders the dashboard with KPIs and payments table", async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    // Check page header
    expect(screen.getByText("Liquidity Overview")).toBeInTheDocument();

    // Wait for the mock payment to load and render
    await waitFor(() => {
      expect(screen.getByText("Siemens AG")).toBeInTheDocument();
    });

    // Check that the amount is rendered
    expect(screen.getByText("1,250,000.00")).toBeInTheDocument();
  });
});
