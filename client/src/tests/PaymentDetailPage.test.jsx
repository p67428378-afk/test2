import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import PaymentDetailPage from "../pages/PaymentDetailPage.jsx";
import * as api from "../services/api.js";

// Mock the API module
vi.mock("../services/api.js", () => ({
  getPaymentDetail: vi.fn().mockResolvedValue({
    payment_id: "pay-123456",
    amount: 1000.0,
    source_currency: "USD",
    target_currency: "EUR",
    rate: 1.0842,
    fee: 10.0,
    settlement_network: "SWIFT",
    source_account_id: "acc-123",
    beneficiary_name: "Siemens AG",
    beneficiary_account_number: "DE123456789",
    beneficiary_routing_number: "AAAADEBBXXX",
    destination_country: "DE",
    status: "Settled",
    compliance_check: {
      check_id: "comp-123",
      sanction_screen_status: "Passed",
      risk_score: 15,
      status: "Passed",
      details: "No sanctions matches found.",
    },
    fraud_score: {
      score_id: "fraud-123",
      score: 8,
      status: "Passed",
      details: "Normal transaction pattern.",
    },
    audit_logs: [
      {
        log_id: "log-1",
        timestamp: "2026-06-18T10:36:45.477793+00:00",
        action: "CREATE",
        actor: "Treasury Manager",
        details: "Operation CREATE on table payments",
      },
    ],
  }),
}));

describe("PaymentDetailPage", () => {
  it("renders payment details and audit logs", async () => {
    render(
      <MemoryRouter initialEntries={["/payments/pay-123456"]}>
        <Routes>
          <Route path="/payments/:payment_id" element={<PaymentDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("PAY-123456")).toBeInTheDocument();
    });

    expect(screen.getByText("Siemens AG")).toBeInTheDocument();
    expect(screen.getByText("KYC/AML Compliance Check")).toBeInTheDocument();
    expect(screen.getByText("Immutable Audit Log")).toBeInTheDocument();
  });
});
