import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./services/api", () => ({
  authAPI: {
    login: vi.fn(),
    logout: vi.fn(),
  },
  toursAPI: {
    listTours: vi.fn().mockResolvedValue([]),
  },
  schedulesAPI: {
    listSchedules: vi.fn().mockResolvedValue([]),
  },
  bookingsAPI: {
    getMyBookings: vi.fn().mockResolvedValue([]),
  },
  attendanceAPI: {
    getAttendanceSheet: vi.fn().mockResolvedValue([]),
  },
}));

describe("App", () => {
  it("renders application header and title", async () => {
    render(<App />);
    expect(screen.getByText(/Museum Tours/i)).toBeInTheDocument();
  });
});
