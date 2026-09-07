import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import LeaderboardView from "../LeaderboardView.jsx";
import * as api from "../../services/api.js";

vi.mock("../../services/api.js", () => ({
  getLeaderboard: vi.fn(),
}));

describe("LeaderboardView", () => {
  it("renders winner podium and standings table", async () => {
    vi.mocked(api.getLeaderboard).mockResolvedValue({
      session_id: "sess-1",
      game_name: "Catan Championship",
      status: "completed",
      ranked_players: [
        {
          player_id: "p-2",
          name: "Bob",
          total_score: 20,
          rank: 1,
          is_winner: true,
        },
        {
          player_id: "p-1",
          name: "Alice",
          total_score: 15,
          rank: 2,
          is_winner: false,
        },
      ],
      winners: [{ player_id: "p-2", name: "Bob", total_score: 20 }],
    });

    render(
      <MemoryRouter initialEntries={["/leaderboard/sess-1"]}>
        <Routes>
          <Route path="/leaderboard/:sessionId" element={<LeaderboardView />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/WINNER: Bob \(20 Points\)!/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Full Standings")).toBeInTheDocument();
    });
  });
});
