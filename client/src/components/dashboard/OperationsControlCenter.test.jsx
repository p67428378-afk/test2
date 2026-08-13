import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OperationsControlCenter from "./OperationsControlCenter";

vi.mock("../../services/api", () => ({
  getCrowdDensity: vi.fn().mockResolvedValue({
    total_attendees: 3500,
    active_scans_per_min: 60,
    active_volunteers: 25,
    active_stages: 3,
    stages: [
      {
        stage_id: "stg-1",
        stage_name: "Main Stage",
        location_zone: "Zone A",
        current_occupancy: 4500,
        max_capacity: 5000,
        occupancy_ratio: 0.9,
        alert_status: "THRESHOLD_EXCEEDED_85",
      },
    ],
  }),
  getTelemetryStreamUrl: vi
    .fn()
    .mockReturnValue("http://localhost:8000/api/v1/telemetry/stream"),
}));

describe("OperationsControlCenter Component", () => {
  it("renders KPI cards and stage heatmap title", async () => {
    render(<OperationsControlCenter />);
    expect(
      await screen.findByText("Operations Control Center"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total Attendees Inside")).toBeInTheDocument();
    expect(screen.getByText("Active Scans / Min")).toBeInTheDocument();
  });
});
