import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import DashboardView from "../DashboardView.jsx";
import * as api from "../../services/api.js";

vi.mock("../../services/api.js", () => ({
  getSessions: vi.fn(),
  deleteSession: vi.fn(),
}));

describe("DashboardView", () => {
  it("renders dashboard title and statistics cards", async () => {
    vi.mocked(api.getSessions).mockResolvedValue([
      {
        id: "sess-1",
        game_name: "Catan Championship",
        status: "active",
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        id: "sess-2",
        game_name: "Ticket to Ride",
        status: "completed",
        created_at: "2026-01-02T00:00:00Z",
      },
    ]);

    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Board Game Scorer/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Catan Championship")).toBeInTheDocument();
      expect(screen.getByText("Ticket to Ride")).toBeInTheDocument();
    });
  });

  it("renders empty state when no sessions exist", async () => {
    vi.mocked(api.getSessions).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/No game sessions found/i)).toBeInTheDocument();
    });
  });
});
