import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

// Mock the services
vi.mock("./services/api", () => {
  return {
    authService: {
      isAuthenticated: () => false,
      getUserEmail: () => "test@example.com",
    },
    expenseService: {
      list: () => Promise.resolve([]),
    },
  };
});

describe("App Smoke Test", () => {
  it("renders login page when not authenticated", () => {
    render(<App />);
    expect(screen.getByText(/Sign in to FinTrack/i)).toBeInTheDocument();
  });
});
