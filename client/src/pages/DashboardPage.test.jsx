import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import DashboardPage from "./DashboardPage";

// Mock api calls
vi.mock("../services/api", () => ({
  default: {
    getHives: vi.fn().mockResolvedValue([{ id: "h1", hive_number: "HIVE-01" }]),
    getHarvests: vi
      .fn()
      .mockResolvedValue([{ id: "harv1", quantity_kg: 25.5 }]),
    getDiseaseReports: vi.fn().mockResolvedValue([]),
    getInspections: vi.fn().mockResolvedValue([]),
    getSeasonalAnalytics: vi.fn().mockResolvedValue({
      season: "Summer",
      year: 2026,
      avg_temperature_celsius: 34.5,
      avg_humidity_percent: 61.2,
      trends: [],
    }),
  },
}));

describe("DashboardPage Component", () => {
  it("renders dashboard heading and stat elements", async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Apiary Telemetry & Operational Overview/i),
    ).toBeInTheDocument();
  });
});
