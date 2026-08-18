import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TourCard from "./TourCard";

const mockTour = {
  id: "tour-1",
  name: "Renaissance Art Tour",
  description: "Explore 15th century masterworks.",
  duration_minutes: 60,
};

const mockSchedules = [
  {
    id: "sched-1",
    tour_id: "tour-1",
    start_time: "2026-10-12T10:00:00Z",
    max_capacity: 20,
    remaining_capacity: 15,
    guide: { full_name: "John Doe" },
  },
];

describe("TourCard Component", () => {
  it("renders tour name, duration, and schedule details", () => {
    const handleBook = vi.fn();
    render(
      <TourCard
        tour={mockTour}
        schedules={mockSchedules}
        onBook={handleBook}
      />,
    );

    expect(screen.getByText("Renaissance Art Tour")).toBeInTheDocument();
    expect(
      screen.getByText(/Explore 15th century masterworks/),
    ).toBeInTheDocument();
    expect(screen.getByText("15 left")).toBeInTheDocument();
    expect(screen.getByText("Book")).toBeInTheDocument();
  });
});
