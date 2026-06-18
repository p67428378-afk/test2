import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import InitiatePaymentPage from "../pages/InitiatePaymentPage.jsx";
import * as api from "../services/api.js";

// Mock the API module
vi.mock("../services/api.js", () => ({
  getFXRates: vi.fn().mockResolvedValue({
    ask_rate: 1.0842,
    base_rate: 1.08,
    bid_rate: 1.075,
    converted_amount: 1084.2,
    expires_at: new Date(Date.now() + 30000).toISOString(),
    fee: 10.0,
    provider: "Swissquote",
    rate: 1.0842,
    rate_lock_id: "lock-123456",
    source_currency: "USD",
    spread: 0.0042,
    target_currency: "EUR",
  }),
  createPayment: vi.fn().mockResolvedValue({
    payment_id: "pay-123456",
    status: "Settled",
    compliance_status: "Passed",
    fraud_status: "Passed",
    settlement_status: "Settled",
  }),
}));

describe("InitiatePaymentPage", () => {
  it("renders the payment initiation form", () => {
    render(
      <MemoryRouter>
        <InitiatePaymentPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Initiate Cross-Border Payment"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Beneficiary Name/i)).toBeInTheDocument();
  });

  it("fetches and displays FX rates when amount is entered", async () => {
    render(
      <MemoryRouter>
        <InitiatePaymentPage />
      </MemoryRouter>,
    );

    const amountInput = screen.getByLabelText(/Amount/i);
    fireEvent.change(amountInput, { target: { value: "1000" } });

    await waitFor(() => {
      expect(screen.getByText(/FX Rate Lock Details/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Swissquote")).toBeInTheDocument();
  });
});
