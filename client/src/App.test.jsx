import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the API services to prevent real network calls during tests
vi.mock("./services/api", () => ({
  authService: {
    getMe: vi.fn().mockRejectedValue(new Error("Not logged in")),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
  jobsService: {
    listJobs: vi.fn().mockResolvedValue({ items: [], total: 0 }),
    getJob: vi.fn(),
    createJob: vi.fn(),
    updateJob: vi.fn(),
    deleteJob: vi.fn(),
  },
  applicationsService: {
    listApplications: vi.fn(),
    applyForJob: vi.fn(),
    updateStatus: vi.fn(),
  },
  default: {},
}));

describe("App Smoke Test", () => {
  it("renders the main application and navbar", async () => {
    render(<App />);

    // Check if the brand name is rendered
    const brandElement = await screen.findByText(/NicheJobs/i);
    expect(brandElement).toBeInTheDocument();

    // Check if the "Find Jobs" link is rendered
    const findJobsLink = screen.getByText(/Find Jobs/i);
    expect(findJobsLink).toBeInTheDocument();
  });
});
