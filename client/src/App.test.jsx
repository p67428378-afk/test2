import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock API services
vi.mock("./services/api.js", () => ({
  clockService: {
    getServerTime: vi.fn().mockResolvedValue({
      utc_datetime: "2026-08-12T12:00:00Z",
      timezone: "UTC",
      timestamp_ms: 1786536000000,
    }),
  },
  alarmService: {
    getAlarms: vi.fn().mockResolvedValue([
      {
        id: "1",
        time: "07:30",
        label: "Morning Alarm",
        enabled: true,
        repeat_days: ["MON", "TUE"],
        sound_type: "mechanical_bell",
        snooze_duration_minutes: 5,
      },
    ]),
    createAlarm: vi.fn(),
    updateAlarm: vi.fn(),
    deleteAlarm: vi.fn(),
  },
  settingsService: {
    getSettings: vi.fn().mockResolvedValue({
      clock_mode: "flip",
      theme_id: "antique_brass",
      time_format: "12h",
      show_second_hand: true,
      time_zone: "UTC",
    }),
    updateSettings: vi.fn(),
  },
}));

describe("Vintage Clock App", () => {
  test("renders Vintage Clock header", async () => {
    render(<App />);
    const heading = await screen.findByText(/Vintage Clock/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders mode switcher buttons", async () => {
    render(<App />);
    expect(await screen.findByText(/Flip View/i)).toBeInTheDocument();
    expect(await screen.findByText(/Analog View/i)).toBeInTheDocument();
    expect(await screen.findByText(/Hybrid View/i)).toBeInTheDocument();
  });

  test("renders active alarms section", async () => {
    render(<App />);
    expect(await screen.findByText(/Active Alarms/i)).toBeInTheDocument();
  });
});
