import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "./App.jsx";
import * as api from "./services/api.js";

// Mock the API module
vi.mock("./services/api.js", () => {
  return {
    getNotifications: vi.fn(),
    respondToTransaction: vi.fn(),
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

describe("Apex Premier Security Alerts App", () => {
  const mockNotifications = [
    {
      id: "11111111-2222-3333-4444-555555555555",
      transaction_id: "tx-101",
      user_id: "99999999-9999-9999-9999-999999999999",
      amount: 2450.0,
      merchant: "Best Buy #1402",
      status: "PENDING",
      decision: null,
      response_channel: null,
      created_at: "2026-07-02T10:51:00.170139+00:00",
    },
    {
      id: "22222222-3333-4444-5555-666666666666",
      transaction_id: "tx-102",
      user_id: "99999999-9999-9999-9999-999999999999",
      amount: 1200.0,
      merchant: "Apple Store",
      status: "APPROVED",
      decision: "APPROVE",
      response_channel: "Push",
      created_at: "2026-07-01T09:14:00.000000+00:00",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getNotifications.mockResolvedValue({
      items: mockNotifications,
      total: 2,
    });
  });

  it("renders the dashboard with notifications and active alert banner", async () => {
    render(<App />);

    // Wait for notifications to load
    await waitFor(() => {
      expect(screen.getByText("Best Buy #1402")).toBeInTheDocument();
    });

    // Check header and KPI grid
    expect(screen.getByText("Alert Center")).toBeInTheDocument();
    expect(screen.getByText("Active Alerts")).toBeInTheDocument();
    expect(screen.getByText("Monitored Cards")).toBeInTheDocument();

    // Check active alert banner
    expect(screen.getByText("ACTION REQUIRED")).toBeInTheDocument();
    expect(screen.getByText(/Transaction of/)).toBeInTheDocument();
    expect(screen.getByText("$2450.00")).toBeInTheDocument();

    // Check history table
    expect(screen.getByText("Apple Store")).toBeInTheDocument();
    expect(screen.getByText("$1200.00")).toBeInTheDocument();
  });

  it("handles transaction approval flow", async () => {
    api.respondToTransaction.mockResolvedValue({
      status: "success",
      message: "Decision processed successfully",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Best Buy #1402")).toBeInTheDocument();
    });

    // Click Approve button
    const approveButton = screen.getByRole("button", {
      name: /Approve Transaction/i,
    });
    fireEvent.click(approveButton);

    // Should show confirmation page
    await waitFor(() => {
      expect(screen.getByText("Transaction Approved")).toBeInTheDocument();
    });

    // Click Back to Dashboard
    const backButton = screen.getByRole("button", {
      name: /Back to Dashboard/i,
    });
    fireEvent.click(backButton);

    // Should return to dashboard
    expect(screen.getByText("Alert Center")).toBeInTheDocument();
  });

  it("handles transaction block flow", async () => {
    api.respondToTransaction.mockResolvedValue({
      status: "success",
      message: "Decision processed successfully",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Best Buy #1402")).toBeInTheDocument();
    });

    // Click Block button
    const blockButton = screen.getByRole("button", {
      name: /Block & Freeze Card/i,
    });
    fireEvent.click(blockButton);

    // Should show confirmation page
    await waitFor(() => {
      expect(screen.getByText("Card Frozen & Blocked")).toBeInTheDocument();
    });
  });
});
