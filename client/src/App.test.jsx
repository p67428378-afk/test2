import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import * as api from "./services/api";

// Mock the API service
vi.mock("./services/api", () => ({
  getFDProducts: vi.fn(),
  getAccountDetails: vi.fn(),
  createFD: vi.fn(),
}));

describe("Fixed Deposit Application Flow", () => {
  const mockProducts = {
    products: [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Short Term Saver",
        tenure_months: 6,
        interest_rate: 4.5,
        min_deposit: 1000,
        badge: "Popular",
      },
    ],
  };

  const mockAccount = {
    id: "88888888-8888-8888-8888-888888888888",
    account_number: "SAV-123456",
    balance: 10000,
    currency: "USD",
  };

  const mockFDResult = {
    fd_account_number: "FD-ABC12345",
    interest_rate: 4.5,
    maturity_amount: 5112.5,
    maturity_date: "2026-12-31T00:00:00Z",
    principal_amount: 5000,
    status: "ACTIVE",
    tenure_months: 6,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.getFDProducts.mockResolvedValue(mockProducts);
    api.getAccountDetails.mockResolvedValue(mockAccount);
    api.createFD.mockResolvedValue(mockFDResult);
  });

  it("renders the product catalog and navigates through the creation flow", async () => {
    render(<App />);

    // 1. Product Catalog Page
    await waitFor(() => {
      expect(screen.getByText("Short Term Saver")).toBeInTheDocument();
    });

    expect(screen.getByText("6 Months")).toBeInTheDocument();
    expect(screen.getByText("4.5% p.a.")).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /Configure Deposit/i });
    fireEvent.click(nextBtn);

    // 2. Configure Deposit Page
    await waitFor(() => {
      expect(screen.getByText("SAV-123456")).toBeInTheDocument();
    });

    const amountInput = screen.getByPlaceholderText(/Min. \$1,000/i);
    fireEvent.change(amountInput, { target: { value: "5000" } });

    // Check maturity estimator
    expect(screen.getByText("Total Interest Earned")).toBeInTheDocument();

    const reviewBtn = screen.getByRole("button", {
      name: /Review Investment/i,
    });
    fireEvent.click(reviewBtn);

    // 3. Confirmation Page
    expect(screen.getByText("Investment Summary")).toBeInTheDocument();
    expect(screen.getByText("Principal Amount")).toBeInTheDocument();

    const pinInput = screen.getByLabelText(/Enter 4-Digit Secure PIN/i);
    fireEvent.change(pinInput, { target: { value: "1234" } });

    const confirmBtn = screen.getByRole("button", {
      name: /Confirm & Open Fixed Deposit/i,
    });
    fireEvent.click(confirmBtn);

    // 4. Success Page
    await waitFor(() => {
      expect(screen.getByText("Fixed Deposit Opened!")).toBeInTheDocument();
    });

    expect(screen.getByText("FD-ABC12345")).toBeInTheDocument();
    expect(screen.getByText("$5,000.00")).toBeInTheDocument();

    const doneBtn = screen.getByRole("button", { name: /Go to Dashboard/i });
    fireEvent.click(doneBtn);

    // Back to catalog
    await waitFor(() => {
      expect(screen.getByText("Short Term Saver")).toBeInTheDocument();
    });
  });
});
