import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TourCatalog from "./TourCatalog";

describe("TourCatalog Component", () => {
  const mockSchedules = [
    {
      id: "sched-1",
      tour_title: "Mona Lisa & Renaissance Highlights",
      start_time: "2026-09-01T10:00:00Z",
      end_time: "2026-09-01T11:30:00Z",
      max_capacity: 20,
      booked_tickets: 5,
      remaining_capacity: 15,
      guide_name: "Jean Dupont",
      status: "Published",
    },
    {
      id: "sched-2",
      tour_title: "Ancient Egypt Crypts",
      start_time: "2026-09-01T14:00:00Z",
      end_time: "2026-09-01T15:30:00Z",
      max_capacity: 15,
      booked_tickets: 15,
      remaining_capacity: 0,
      guide_name: "Claire Moreau",
      status: "Published",
    },
  ];

  it("renders tour schedule cards and remaining capacity badges", () => {
    render(
      <TourCatalog
        schedules={mockSchedules}
        selectedSchedule={null}
        onSelectSchedule={() => {}}
        isLoading={false}
      />,
    );

    expect(
      screen.getByText(/Mona Lisa & Renaissance Highlights/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ancient Egypt Crypts/i)).toBeInTheDocument();
    expect(screen.getByText(/15 seats left/i)).toBeInTheDocument();
    expect(screen.getByText(/Sold Out/i)).toBeInTheDocument();
  });

  it("triggers onSelectSchedule when a schedule card is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <TourCatalog
        schedules={mockSchedules}
        selectedSchedule={null}
        onSelectSchedule={handleSelect}
        isLoading={false}
      />,
    );

    const card = screen.getByText(/Mona Lisa & Renaissance Highlights/i);
    fireEvent.click(card);
    expect(handleSelect).toHaveBeenCalledWith(mockSchedules[0]);
  });
});
