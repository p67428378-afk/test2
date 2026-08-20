import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the API services to avoid real network calls during tests
vi.mock("./services/api", () => {
  return {
    authService: {
      getCurrentUser: vi.fn(() => null), // Not logged in by default
      login: vi.fn(),
      logout: vi.fn(),
    },
    habitsService: {
      getHabits: vi.fn(() => Promise.resolve([])),
      completeHabit: vi.fn(),
    },
    parentService: {
      getProgress: vi.fn(() => Promise.resolve([])),
      getHabitsAll: vi.fn(() => Promise.resolve([])),
      toggleHabit: vi.fn(),
      resetProgress: vi.fn(),
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe("App Component Smoke Test", () => {
  it("renders login page when not authenticated", () => {
    render(<App />);
    expect(screen.getByText(/Healthy Habits Hero/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Log in to start your healthy journey!/i),
    ).toBeInTheDocument();
  });
});
