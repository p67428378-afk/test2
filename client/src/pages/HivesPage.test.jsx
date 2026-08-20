import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import HivesPage from "./HivesPage";

vi.mock("../services/api", () => ({
  default: {
    getApiaries: vi
      .fn()
      .mockResolvedValue([
        { id: "a1", name: "Sunny Valley Apiary", location: "Plot 4B" },
      ]),
    getHives: vi
      .fn()
      .mockResolvedValue([
        {
          id: "h1",
          apiary_id: "a1",
          hive_number: "HIVE-01",
          queen_breed: "Italian",
          status: "active",
          estimated_population: 45000,
        },
      ]),
    createHive: vi.fn().mockResolvedValue({ id: "h2", hive_number: "HIVE-02" }),
    updateHive: vi.fn().mockResolvedValue({ id: "h1", status: "quarantine" }),
    ingestTelemetry: vi
      .fn()
      .mockResolvedValue({ id: "t1", status: "ingested" }),
  },
}));

describe("HivesPage Component", () => {
  it("renders hives inventory page title and table", async () => {
    render(
      <BrowserRouter>
        <HivesPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Hives Inventory & Telemetry Management/i),
    ).toBeInTheDocument();
  });
});
