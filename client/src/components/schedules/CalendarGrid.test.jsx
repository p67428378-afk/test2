import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CalendarGrid from "./CalendarGrid.jsx";

const mockSchedules = [
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
];

describe("CalendarGrid Component", () => {
  it("renders schedules correctly", () => {
    render(
      <CalendarGrid schedules={mockSchedules} onSelectSchedule={() => {}} />,
    );
    expect(screen.getByText("RV Atlantis")).toBeInTheDocument();
    expect(screen.getByText("Woods Hole to Bermuda")).toBeInTheDocument();
    expect(screen.getByText("Port: BDA-HAM")).toBeInTheDocument();
    expect(screen.getByText("Underway")).toBeInTheDocument();
  });

  it("calls onSelectSchedule when a card is clicked", () => {
    const onSelectScheduleMock = vi.fn();
    render(
      <CalendarGrid
        schedules={mockSchedules}
        onSelectSchedule={onSelectScheduleMock}
      />,
    );

    const card = screen.getByText("RV Atlantis");
    fireEvent.click(card);

    expect(onSelectScheduleMock).toHaveBeenCalledWith(mockSchedules[0]);
  });
});
