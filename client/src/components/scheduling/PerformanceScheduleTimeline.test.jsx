import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PerformanceScheduleTimeline from "./PerformanceScheduleTimeline";

describe("PerformanceScheduleTimeline Component", () => {
  const mockPerformances = [
    {
      id: "p1",
      artist_id: "a1",
      stage_id: "s1",
      start_time: "2026-08-15T20:00:00Z",
      end_time: "2026-08-15T22:00:00Z",
      status: "SCHEDULED",
      artist: { name: "Headliner Band A", genre: "Rock" },
      stage: { name: "Main Stage", location_zone: "North Field" },
    },
  ];

  it("renders performance cards and schedule button", () => {
    render(
      <PerformanceScheduleTimeline
        performances={mockPerformances}
        artists={[]}
        stages={[]}
        onRefresh={() => {}}
      />,
    );

    expect(screen.getByText("Headliner Band A")).toBeInTheDocument();
    expect(screen.getByText("Main Stage")).toBeInTheDocument();
    expect(screen.getByText("Schedule Slot")).toBeInTheDocument();
  });
});
