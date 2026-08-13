import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StageScheduleTimeline } from "./StageScheduleTimeline";

vi.mock("../../services/api", () => ({
  getStages: vi
    .fn()
    .mockResolvedValue([
      {
        id: "stage-1",
        name: "Main Stage",
        location_zone: "Zone A",
        max_capacity: 10000,
      },
    ]),
  getArtists: vi
    .fn()
    .mockResolvedValue([
      { id: "art-1", name: "Headliner Band", genre: "Rock" },
    ]),
  getStagePerformances: vi.fn().mockResolvedValue([
    {
      id: "perf-1",
      artist_id: "art-1",
      artist_name: "Headliner Band",
      start_time: "2026-08-15T18:00:00Z",
      end_time: "2026-08-15T19:30:00Z",
      buffer_minutes: 30,
      status: "SCHEDULED",
    },
  ]),
  getStageNotifications: vi.fn().mockResolvedValue([]),
}));

describe("StageScheduleTimeline Component", () => {
  it("renders header and stage timeline", async () => {
    render(<StageScheduleTimeline />);
    expect(
      await screen.findByText("Artist Scheduling & Stage Allocation"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Headliner Band")).toBeInTheDocument();
  });
});
