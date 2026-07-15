import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "./App.jsx";
import * as api from "./services/api.js";

// Mock the API service
vi.mock("./services/api.js", () => ({
  getScheduleSlots: vi.fn(),
  createScheduleSlot: vi.fn(),
  updateScheduleSlot: vi.fn(),
  deleteScheduleSlot: vi.fn(),
}));

describe("Chronos Weekly Schedule App", () => {
  const mockSlots = [
    {
      id: "1",
      title: "CS101: Intro to Computer Science",
      day_of_week: "Monday",
      start_time: "09:00:00",
      end_time: "10:30:00",
      notes: "Tech Hall Room 402. Bring laptop.",
    },
    {
      id: "2",
      title: "Physics Lab",
      day_of_week: "Tuesday",
      start_time: "14:00:00",
      end_time: "16:00:00",
      notes: "Science Building Room 104.",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getScheduleSlots.mockResolvedValue(mockSlots);
  });

  it("renders the dashboard with schedule slots", async () => {
    render(<App />);

    // Verify loading state
    expect(screen.getByText(/Loading your schedule.../i)).toBeInTheDocument();

    // Wait for slots to load
    await waitFor(() => {
      expect(
        screen.getByText("CS101: Intro to Computer Science"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Physics Lab")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
  });

  it("validates that end time cannot be earlier than or equal to start time", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("CS101: Intro to Computer Science"),
      ).toBeInTheDocument();
    });

    // Click Add New Slot button (desktop version)
    const addButtons = screen.getAllByRole("button", { name: /Add New Slot/i });
    fireEvent.click(addButtons[0]);

    // Fill out form with invalid times
    fireEvent.change(screen.getByLabelText(/Event Title/i), {
      target: { value: "Invalid Event" },
    });
    fireEvent.change(screen.getByLabelText(/Start Time/i), {
      target: { value: "11:00" },
    });
    fireEvent.change(screen.getByLabelText(/End Time/i), {
      target: { value: "10:00" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Save Slot/i }));

    // Check for validation error message
    expect(
      screen.getByText(/End Time must be later than Start Time/i),
    ).toBeInTheDocument();
    expect(api.createScheduleSlot).not.toHaveBeenCalled();
  });
});
