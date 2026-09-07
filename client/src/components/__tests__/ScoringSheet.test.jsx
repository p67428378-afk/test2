import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import ScoringSheet from "../ScoringSheet.jsx";
import * as api from "../../services/api.js";

vi.mock("../../services/api.js", () => ({
  getSession: vi.fn(),
  getPlayers: vi.fn(),
  getScores: vi.fn(),
  submitScore: vi.fn(),
  updateSession: vi.fn(),
}));

describe("ScoringSheet", () => {
  it("renders scoring sheet with player cards", async () => {
    vi.mocked(api.getSession).mockResolvedValue({
      id: "sess-1",
      game_name: "Monopoly",
      status: "active",
    });
    vi.mocked(api.getPlayers).mockResolvedValue([
      { id: "p-1", session_id: "sess-1", name: "Alice" },
      { id: "p-2", session_id: "sess-1", name: "Bob" },
    ]);
    vi.mocked(api.getScores).mockResolvedValue([
      {
        id: "sc-1",
        session_id: "sess-1",
        player_id: "p-1",
        points: 15,
        round_or_category: "Round 1",
      },
      {
        id: "sc-2",
        session_id: "sess-1",
        player_id: "p-2",
        points: 20,
        round_or_category: "Round 1",
      },
    ]);

    render(
      <MemoryRouter initialEntries={["/scoring/sess-1"]}>
        <Routes>
          <Route path="/scoring/:sessionId" element={<ScoringSheet />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Score Sheet: Monopoly/i)).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });
});
