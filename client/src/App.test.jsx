import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

vi.mock("./services/api.js", () => ({
  poseService: {
    getPoses: vi.fn().mockResolvedValue([]),
    getFavorites: vi.fn().mockResolvedValue([]),
  },
  routineService: {
    getRoutines: vi.fn().mockResolvedValue([]),
  },
  practiceService: {
    getPracticeSessions: vi.fn().mockResolvedValue([]),
  },
}));

describe("App Component", () => {
  it("renders YogaFlow Studio title and pose catalog by default", async () => {
    render(<App />);

    expect(screen.getByText("YogaFlow Studio")).toBeInTheDocument();
    expect(
      screen.getByText(/Yoga Pose Dictionary & Asana Library/i),
    ).toBeInTheDocument();
  });
});
