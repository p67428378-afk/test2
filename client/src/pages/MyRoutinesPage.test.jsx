import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import MyRoutinesPage from "./MyRoutinesPage";

vi.mock("../services/api", () => ({
  routineService: {
    getRoutines: vi.fn().mockResolvedValue([
      {
        id: "r-1",
        name: "Morning Flow",
        description: "15-minute flow",
        total_duration_seconds: 900,
        poses: [],
      },
    ]),
    deleteRoutine: vi.fn().mockResolvedValue({ message: "Deleted" }),
    duplicateRoutine: vi.fn().mockResolvedValue({ id: "r-2" }),
    exportRoutine: vi.fn().mockResolvedValue(new Blob([])),
  },
  practiceService: {
    getPracticeSessions: vi.fn().mockResolvedValue([]),
  },
}));

describe("MyRoutinesPage", () => {
  it("renders my routines heading and action buttons", async () => {
    render(
      <BrowserRouter>
        <MyRoutinesPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/My Custom Yoga Routines & Practice Logs/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/\+ Create New Routine/i)).toBeInTheDocument();
  });
});
