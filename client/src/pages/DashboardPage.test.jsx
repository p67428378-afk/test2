import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardPage from "./DashboardPage";

// Mock the API calls
vi.mock("../services/api", () => ({
  getItems: vi.fn().mockResolvedValue([]),
  getItemMatches: vi.fn().mockResolvedValue([]),
  createClaim: vi.fn().mockResolvedValue({}),
  getClaimMessages: vi.fn().mockResolvedValue([]),
  createClaimMessage: vi.fn().mockResolvedValue({}),
  logoutUser: vi.fn(),
}));

describe("DashboardPage Component", () => {
  it("renders dashboard with stats cards", async () => {
    render(
      <Router>
        <DashboardPage />
      </Router>,
    );
    expect(screen.getByText("Total Reported")).toBeInTheDocument();
    expect(screen.getByText("Lost Items")).toBeInTheDocument();
    expect(screen.getByText("Found Items")).toBeInTheDocument();
    expect(screen.getByText("Returned Items")).toBeInTheDocument();
  });
});
