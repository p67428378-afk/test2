import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SwissPairingMatrix from "./SwissPairingMatrix";

describe("SwissPairingMatrix Component", () => {
  const sampleTournament = { id: "t1", name: "Spring Swiss 2026" };
  const sampleRounds = [
    {
      id: "r1",
      round_number: 1,
      is_closed: false,
      matches: [
        {
          id: "m1",
          board_number: 1,
          white_player_name: "Player A",
          black_player_name: "Player B",
          result: "PENDING",
          is_bye: false,
        },
      ],
    },
  ];

  it("renders pairings and match board cards", () => {
    render(
      <SwissPairingMatrix
        activeTournament={sampleTournament}
        rounds={sampleRounds}
      />,
    );

    expect(screen.getByText("Swiss Pairing Matrix")).toBeInView();
    expect(screen.getByText("Player A")).toBeInView();
    expect(screen.getByText("Player B")).toBeInView();
    expect(screen.getByText("Auto-Pair Next Round")).toBeInView();
  });

  it("renders empty round message when no matches exist", () => {
    render(
      <SwissPairingMatrix activeTournament={sampleTournament} rounds={[]} />,
    );

    expect(screen.getByText("No pairings for this round yet.")).toBeInView();
  });
});
