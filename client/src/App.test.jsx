import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

// Mock the API service
vi.mock("./services/api", () => {
  return {
    apiService: {
      getAnimals: vi.fn().mockResolvedValue([
        {
          id: "1",
          name: "Elara",
          species: "Elephant",
          gps_tag_id: "GPS-EL-902",
        },
      ]),
      getLatestLocations: vi.fn().mockResolvedValue([
        {
          id: "1",
          gps_tag_id: "GPS-EL-902",
          latitude: -1.2921,
          longitude: 36.8219,
          timestamp: "2026-07-16T08:50:27Z",
        },
      ]),
      getHealthExaminations: vi.fn().mockResolvedValue([]),
      getProtectedZones: vi.fn().mockResolvedValue([]),
      getMigrationPattern: vi.fn().mockResolvedValue([]),
    },
  };
});

describe("EcoTrack App Smoke Test", () => {
  it("renders the dashboard and sidebar correctly", async () => {
    render(<App />);

    // Check that the app title is rendered
    const titleElement = await screen.findByText("EcoTrack");
    expect(titleElement).toBeInTheDocument();

    // Check that the main navigation tabs are present
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Health Records")).toBeInTheDocument();
    expect(screen.getByText("Zone Management")).toBeInTheDocument();
  });
});
