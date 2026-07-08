import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardPage from "./DashboardPage";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  getRoundupSummary: vi.fn(),
  getTransactions: vi.fn(),
  triggerDailyJob: vi.fn(),
}));

describe("DashboardPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    api.getRoundupSummary.mockReturnValue(new Promise(() => {}));
    api.getTransactions.mockReturnValue(new Promise(() => {}));
    render(<DashboardPage />);
    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  it("renders dashboard data after successful fetch", async () => {
    api.getRoundupSummary.mockResolvedValue({
      is_roundup_enabled: true,
      today_invested_amount: 4.25,
      total_roundup_amount: 342.5,
    });
    api.getTransactions.mockResolvedValue({
      items: [
        {
          id: "1",
          transaction_date: "2026-07-08",
          merchant_name: "Starbucks",
          amount: 4.25,
          roundup_amount: 0.75,
          status: "Invested",
        },
      ],
      total: 1,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Portfolio Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Starbucks")).toBeInTheDocument();
    });
  });

  it("renders error banner when API fails", async () => {
    api.getRoundupSummary.mockRejectedValue(new Error("API Error"));
    api.getTransactions.mockRejectedValue(new Error("API Error"));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("error-banner")).toHaveTextContent(
        "Could not load round-up data.",
      );
    });
  });
});
