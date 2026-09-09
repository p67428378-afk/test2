import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock API calls
vi.mock("./api/client", () => ({
  getPoses: vi.fn().mockResolvedValue([
    {
      id: "pose-1",
      english_name: "Downward-Facing Dog",
      sanskrit_name: "Adho Mukha Svanasana",
      difficulty: "Beginner",
      category: "Inversion",
      alignment_cues: ["Spread fingers wide", "Ground palms"],
      breath_instructions: "Exhale as you press back.",
      target_muscles: ["Hamstrings", "Shoulders"],
      common_mistakes: ["Rounding back"],
    },
  ]),
  getPoseById: vi.fn().mockResolvedValue({
    id: "pose-1",
    english_name: "Downward-Facing Dog",
    sanskrit_name: "Adho Mukha Svanasana",
    difficulty: "Beginner",
    category: "Inversion",
  }),
  getRoutines: vi.fn().mockResolvedValue([
    {
      id: "routine-1",
      name: "Morning Energizer Flow",
      description: "Morning sequence",
      total_duration_seconds: 300,
      items: [],
    },
  ]),
  getRoutineById: vi.fn().mockResolvedValue({
    id: "routine-1",
    name: "Morning Energizer Flow",
    description: "Morning sequence",
    total_duration_seconds: 300,
    items: [],
  }),
  createRoutine: vi.fn().mockResolvedValue({ id: "routine-2" }),
  updateRoutine: vi.fn().mockResolvedValue({ id: "routine-1" }),
  duplicateRoutine: vi.fn().mockResolvedValue({ id: "routine-3" }),
  deleteRoutine: vi.fn().mockResolvedValue(true),
}));

describe("YogaFlow Studio Frontend App", () => {
  it("renders navbar brand title", () => {
    render(<App />);
    expect(screen.getByText("YogaFlow Studio")).toBeInTheDocument();
  });

  it("renders pose catalog header by default", () => {
    render(<App />);
    expect(screen.getByText("Yoga Pose Dictionary")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<App />);
    expect(screen.getByText("Pose Catalog")).toBeInTheDocument();
    expect(screen.getByText("Routine Builder")).toBeInTheDocument();
    expect(screen.getByText("My Routines")).toBeInTheDocument();
  });
});
