import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DashboardPage from "./DashboardPage.jsx";

// Mock the API services
vi.mock("../services/api.js", () => ({
  scheduleService: {
    getSchedules: vi.fn().mockResolvedValue([
      {
        id: "1",
        vessel_name: "RV Atlantis",
        route: "Woods Hole to Bermuda",
        start_date: "2026-01-15T00:00:00Z",
        end_date: "2026-02-02T00:00:00Z",
        destination_port: "BDA-HAM",
        status: "Underway",
        notes: "Deep-sea vent survey",
      },
    ]),
  },
  expeditionService: {
    getExpeditions: vi.fn().mockResolvedValue([
      {
        id: "1",
        name: "Deep-Sea Vent Survey",
        schedule_id: "1",
        start_date: "2026-01-15T00:00:00Z",
        end_date: "2026-02-02T00:00:00Z",
        research_goals: "Study hydrothermal vents",
      },
    ]),
  },
  equipmentService: {
    getEquipment: vi.fn().mockResolvedValue([
      {
        id: "1",
        name: "CTD Sensor",
        serial_number: "CTD-001",
        status: "Operational",
        location: "Deck A",
        last_maintenance_date: "2026-01-01T00:00:00Z",
      },
    ]),
  },
  fuelService: {
    getFuelSummary: vi.fn().mockResolvedValue({
      average_efficiency: 92,
      total_distance_traveled: 1240,
      total_fuel_consumed: 4250,
      logs: [],
    }),
  },
  weatherService: {
    getWeatherAlerts: vi.fn().mockResolvedValue({
      alerts: [
        {
          message: "AMBER ALERT: Gale warning in Sector 4-North.",
          severity: "amber",
          source: "NOAA",
        },
      ],
    }),
  },
}));

describe("DashboardPage Component", () => {
  it("renders dashboard stats and schedules", async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getAllByText("RV Atlantis")[0]).toBeInTheDocument();
      expect(screen.getByText("Deep-Sea Vent Survey")).toBeInTheDocument();
      expect(screen.getByText("4,250")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument(); // 1 operational CTD sensor out of 1 total
    });
  });
});
