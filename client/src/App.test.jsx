// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./services/api.js", () => ({
  parkingService: {
    searchSpots: vi.fn().mockResolvedValue({ total: 0, spots: [] }),
    listSpots: vi.fn().mockResolvedValue([]),
    getSpotDetails: vi.fn().mockResolvedValue({
      id: "1",
      name: "Downtown Garage",
      address: "123 Main St",
    }),
    getSpotRates: vi
      .fn()
      .mockResolvedValue({ base_hourly_rate: 5.0, current_active_rate: 5.0 }),
    getRecentEvents: vi.fn().mockResolvedValue([]),
  },
  getWebSocketUrl: vi
    .fn()
    .mockReturnValue("ws://localhost:8000/api/v1/parking-spots/live-updates"),
  default: {
    interceptors: {
      request: { use: vi.fn() },
    },
  },
}));

describe("App Component", () => {
  it("renders ParkFind Locator header", async () => {
    render(<App />);
    expect(screen.getByText("ParkFind Locator")).toBeInTheDocument();
  });
});
