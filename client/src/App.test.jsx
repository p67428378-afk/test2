import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./services/api.js", () => ({
  default: {
    getCostSummary: vi.fn().mockResolvedValue({
      total_spend: 1250,
      total_events: 3,
      cost_by_type: { "Hardware Replacement": 800, Scheduled: 450 },
      cost_by_location: { "Building A": 1250 },
      monthly_trends: [{ month: "May 2026", total_cost: 1250, event_count: 3 }],
    }),
    getMaintenanceEvents: vi.fn().mockResolvedValue({
      items: [],
      total: 0,
      skip: 0,
      limit: 10,
    }),
    exportMaintenanceCsv: vi.fn().mockResolvedValue(new Blob([])),
  },
}));

describe("App", () => {
  it("renders application navigation and dashboard page", async () => {
    render(<App />);
    expect(screen.getByText(/WiFi Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Cost Analytics & Overview/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Total Spend \(YTD\)/i)).toBeInTheDocument();
    });
  });
});
