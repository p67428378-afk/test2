import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import VolunteerShiftRoster from "./VolunteerShiftRoster";

describe("VolunteerShiftRoster Component", () => {
  const mockShifts = [
    {
      id: "sh-1",
      volunteer_id: "vol-1001",
      zone: "North Gate Validation",
      start_time: "2026-08-15T14:00:00Z",
      end_time: "2026-08-15T18:00:00Z",
      status: "PENDING",
    },
  ];

  it("renders roster table and check-in button", () => {
    render(
      <VolunteerShiftRoster
        shifts={mockShifts}
        volunteers={[]}
        onRefresh={() => {}}
      />,
    );

    expect(screen.getByText(/Volunteer Shift Roster/i)).toBeInTheDocument();
    expect(screen.getByText("North Gate Validation")).toBeInTheDocument();
    expect(screen.getByText("Check In")).toBeInTheDocument();
  });
});
