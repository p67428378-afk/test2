import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API services to avoid real network calls during tests
vi.mock("./services/api", () => {
  return {
    authService: {
      isAuthenticated: () => false,
      login: vi.fn(),
      logout: vi.fn(),
    },
    plotTypeService: {
      getPlotTypes: vi.fn(() => Promise.resolve([])),
    },
    plotService: {
      getPlots: vi.fn(() => Promise.resolve([])),
    },
  };
});

describe("App Component", () => {
  it("renders login page when not authenticated", () => {
    render(<App />);
    expect(screen.getByText("EternalRest Admin")).toBeInTheDocument();
    expect(screen.getByText("Cemetery Management System")).toBeInTheDocument();
    expect(screen.getByLabelText("Username / Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
