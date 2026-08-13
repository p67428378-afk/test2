import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./services/api", () => ({
  getMe: vi.fn().mockRejectedValue(new Error("Unauthenticated")),
  getCrowdDensity: vi.fn().mockResolvedValue({
    total_attendees: 1200,
    active_scans_per_min: 45,
    active_volunteers: 18,
    active_stages: 4,
    stages: [
      {
        stage_id: "s1",
        stage_name: "Main Stage",
        location_zone: "North Field",
        current_occupancy: 4000,
        max_capacity: 5000,
        occupancy_ratio: 0.8,
        alert_status: "NORMAL",
      },
    ],
  }),
  getTelemetryStreamUrl: vi
    .fn()
    .mockReturnValue("http://localhost:8000/api/v1/telemetry/stream"),
}));

describe("App Component", () => {
  it("renders application navigation and dashboard header", async () => {
    render(<App />);
    const headers = await screen.findAllByText(/FestControl/i);
    expect(headers.length).toBeGreaterThan(0);
    expect(screen.getByText(/Control Center/i)).toBeInTheDocument();
  });
});
