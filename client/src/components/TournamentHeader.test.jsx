import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import TournamentHeader from "./TournamentHeader";

describe("TournamentHeader Component", () => {
  const sampleTournaments = [
    {
      id: "t1",
      name: "Winter Open 2026",
      status: "ACTIVE",
      current_round: 2,
      total_rounds: 5,
    },
  ];

  it("renders branding and navigation links", () => {
    render(
      <BrowserRouter>
        <TournamentHeader
          tournaments={sampleTournaments}
          activeTournament={sampleTournaments[0]}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText("ChessMaster")).toBeInView();
    expect(screen.getByText("Dashboard & Roster")).toBeInView();
    expect(screen.getByText("Swiss Pairings")).toBeInView();
    expect(screen.getByText("Live Standings")).toBeInView();
    expect(screen.getByText("Verify Certificates")).toBeInView();
  });

  it("displays action CTAs when callbacks provided", () => {
    const mockRegister = vi.fn();
    const mockFinish = vi.fn();

    render(
      <BrowserRouter>
        <TournamentHeader
          tournaments={sampleTournaments}
          activeTournament={sampleTournaments[0]}
          onOpenRegisterModal={mockRegister}
          onFinishTournament={mockFinish}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText("Register Player")).toBeInView();
    expect(screen.getByText("Finish & Certify")).toBeInView();
  });
});
