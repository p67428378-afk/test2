import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VolunteerRosterManager } from "./VolunteerRosterManager";

vi.mock("../../services/api", () => ({
  getVolunteerShifts: vi.fn().mockResolvedValue([
    {
      id: "shift-1",
      volunteer_id: "vol-102",
      zone_name: "Gate 1 Entrance",
      start_time: "2026-08-15T08:00:00Z",
      end_time: "2026-08-15T12:00:00Z",
      status: "CHECKED_IN",
      check_in_time: "2026-08-15T08:02:00Z",
      volunteer: {
        id: "vol-102",
        full_name: "Volunteer V-102",
        email: "v102@festival.org",
      },
    },
  ]),
  getVolunteerAlerts: vi.fn().mockResolvedValue([]),
  checkInVolunteerShift: vi.fn().mockResolvedValue({ status: "CHECKED_IN" }),
  dropVolunteerShift: vi.fn().mockResolvedValue({ status: "DROPPED" }),
  createVolunteerShift: vi.fn().mockResolvedValue({ id: "shift-2" }),
}));

describe("VolunteerRosterManager Component", () => {
  it("renders header and roster table", async () => {
    render(<VolunteerRosterManager />);
    expect(
      await screen.findByText("Volunteer Roster & Shift Coordination"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Volunteer V-102")).toBeInTheDocument();
    expect(screen.getByText("Gate 1 Entrance")).toBeInTheDocument();
  });
});
