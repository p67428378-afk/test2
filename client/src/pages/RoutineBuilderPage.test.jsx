import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import RoutineBuilderPage from "./RoutineBuilderPage";

vi.mock("../services/api", () => ({
  poseService: {
    getPoses: vi.fn().mockResolvedValue([
      {
        id: "pose-1",
        english_name: "Warrior I",
        sanskrit_name: "Virabhadrasana I",
        category: "Standing",
        difficulty: "Beginner",
      },
    ]),
  },
  routineService: {
    getRoutine: vi.fn().mockResolvedValue(null),
    createRoutine: vi.fn().mockResolvedValue({ id: "rot-1" }),
    updateRoutine: vi.fn().mockResolvedValue({ id: "rot-1" }),
    exportRoutine: vi.fn().mockResolvedValue(new Blob([])),
  },
}));

describe("RoutineBuilderPage", () => {
  it("renders routine builder controls and pose drawer", async () => {
    render(
      <BrowserRouter>
        <RoutineBuilderPage />
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText(/Routine Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Pose Library Drawer/i)).toBeInTheDocument();
  });
});
