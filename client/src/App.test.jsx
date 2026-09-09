import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock API module so tests run cleanly in isolation
vi.mock("./services/api.js", () => ({
  getCurrentUser: vi
    .fn()
    .mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      full_name: "Test User",
    }),
  getWateringNotifications: vi.fn().mockResolvedValue({ total_alerts: 2 }),
  getDashboardSchedules: vi.fn().mockResolvedValue({
    due_today: [],
    overdue: [],
    upcoming: [],
    summary_stats: {
      total_plants: 0,
      overdue_count: 0,
      due_today_count: 0,
      healthy_count: 0,
      care_score: 100,
    },
  }),
  getSpeciesList: vi.fn().mockResolvedValue([]),
  getUserPlants: vi.fn().mockResolvedValue([]),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
}));

describe("SproutCare App Smoke Tests", () => {
  it("renders navbar brand logo and navigation links without crashing", async () => {
    render(<App />);
    expect(screen.getByText(/SproutCare/i)).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("My Garden")).toBeInTheDocument();
    expect(screen.getByText("Species Catalog")).toBeInTheDocument();
  });
});
