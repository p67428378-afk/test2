import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the API services
vi.mock("./services/api", () => {
  return {
    incidentService: {
      getIncidents: vi.fn().mockResolvedValue({ items: [], total: 0 }),
      createIncident: vi.fn(),
      updateIncident: vi.fn(),
      getRCA: vi.fn(),
      saveRCA: vi.fn(),
    },
    userService: {
      getUsers: vi.fn().mockResolvedValue([]),
      createUser: vi.fn(),
    },
  };
});

describe("App Smoke Test", () => {
  it("renders loading state initially", () => {
    render(<App />);
    expect(
      screen.getByText(/Loading IT Command Center.../i),
    ).toBeInTheDocument();
  });
});
