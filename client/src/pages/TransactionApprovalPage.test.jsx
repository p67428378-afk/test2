import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TransactionApprovalPage from "./TransactionApprovalPage";
import * as api from "../services/api";

// Mock the API service
vi.mock("../services/api", () => ({
  getTransactionDetails: vi.fn(),
  submitTransactionAction: vi.fn(),
}));

describe("TransactionApprovalPage", () => {
  const mockTransaction = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    merchant_name: "Best Buy Store #1402",
    amount: 2450.0,
    status: "pending",
    created_at: "2026-07-06T18:51:00Z",
    expires_at: new Date(Date.now() + 600000).toISOString(), // 10 mins from now
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    vi.mocked(api.getTransactionDetails).mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter
        initialEntries={[
          "/transactions/123e4567-e89b-12d3-a456-426614174000/verify?token=valid_token",
        ]}
      >
        <Routes>
          <Route
            path="/transactions/:id/verify"
            element={<TransactionApprovalPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Verifying secure connection.../i),
    ).toBeInTheDocument();
  });

  it("renders transaction details on successful fetch", async () => {
    vi.mocked(api.getTransactionDetails).mockResolvedValue(mockTransaction);

    render(
      <MemoryRouter
        initialEntries={[
          "/transactions/123e4567-e89b-12d3-a456-426614174000/verify?token=valid_token",
        ]}
      >
        <Routes>
          <Route
            path="/transactions/:id/verify"
            element={<TransactionApprovalPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Best Buy Store #1402")).toBeInTheDocument();
      expect(screen.getByText("$2,450.00")).toBeInTheDocument();
    });
  });

  it("handles approve action successfully", async () => {
    vi.mocked(api.getTransactionDetails).mockResolvedValue(mockTransaction);
    vi.mocked(api.submitTransactionAction).mockResolvedValue({
      id: mockTransaction.id,
      status: "approved",
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/transactions/123e4567-e89b-12d3-a456-426614174000/verify?token=valid_token",
        ]}
      >
        <Routes>
          <Route
            path="/transactions/:id/verify"
            element={<TransactionApprovalPage />}
          />
          <Route path="/success" element={<div>Success Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Best Buy Store #1402")).toBeInTheDocument();
    });

    const approveButton = screen.getByRole("button", {
      name: /Approve Transaction/i,
    });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(api.submitTransactionAction).toHaveBeenCalledWith(
        "123e4567-e89b-12d3-a456-426614174000",
        "approve",
        "valid_token",
      );
    });
  });

  it("handles block action and shows instant digital card provisioning flow", async () => {
    vi.mocked(api.getTransactionDetails).mockResolvedValue(mockTransaction);
    vi.mocked(api.submitTransactionAction).mockResolvedValue({
      id: mockTransaction.id,
      status: "blocked",
      wallet_token: "mock_wallet_token_123",
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/transactions/123e4567-e89b-12d3-a456-426614174000/verify?token=valid_token",
        ]}
      >
        <Routes>
          <Route
            path="/transactions/:id/verify"
            element={<TransactionApprovalPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Best Buy Store #1402")).toBeInTheDocument();
    });

    const blockButton = screen.getByRole("button", {
      name: /Block & Report Fraud/i,
    });
    fireEvent.click(blockButton);

    await waitFor(() => {
      expect(api.submitTransactionAction).toHaveBeenCalledWith(
        "123e4567-e89b-12d3-a456-426614174000",
        "block",
        "valid_token",
      );
    });

    // Verify that the physical card killed screen is shown instead of redirecting
    await waitFor(() => {
      expect(
        screen.getByText("Physical Card Plastic Killed"),
      ).toBeInTheDocument();
      expect(screen.getByText(/Add to Apple Wallet/i)).toBeInTheDocument();
      expect(screen.getByText(/Add to Google Wallet/i)).toBeInTheDocument();
    });

    // Click Add to Apple Wallet
    const appleWalletBtn = screen.getByRole("button", {
      name: /Add to Apple Wallet/i,
    });
    fireEvent.click(appleWalletBtn);

    // Verify success message after simulation
    await waitFor(
      () => {
        expect(
          screen.getByText(/Successfully added to your Wallet!/i),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});
