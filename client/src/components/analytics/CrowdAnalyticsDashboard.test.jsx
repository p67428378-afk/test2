import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CrowdAnalyticsDashboard } from "./CrowdAnalyticsDashboard";

vi.mock("../../services/api", () => ({
  getCrowdAnalytics: vi.fn().mockResolvedValue([
    {
      zone_id: "zone-main-stage",
      zone_name: "Main Stage Ground",
      current_occupancy: 8800,
      max_capacity: 10000,
      occupancy_percentage: 88.0,
      density_status: "WARNING",
      rate_of_change_2min: 400,
      rate_of_change_alert: false,
    },
  ]),
  ingestCrowdTelemetry: vi.fn().mockResolvedValue({ status: "ok" }),
}));

describe("CrowdAnalyticsDashboard Component", () => {
  it("renders title and KPI cards", async () => {
    render(<CrowdAnalyticsDashboard />);
    expect(
      await screen.findByText("Real-Time Crowd Analytics"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total Occupancy")).toBeInTheDocument();
    expect(screen.getByText("85% Warning Zones")).toBeInTheDocument();
  });
});
