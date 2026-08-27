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

    expect(screen.getByText("ChessMaster")).toBeInTheDocument();
    expect(screen.getByText("Dashboard & Roster")).toBeInTheDocument();
    expect(screen.getByText("Swiss Pairings")).toBeInTheDocument();
    expect(screen.getByText("Live Standings")).toBeInTheDocument();
    expect(screen.getByText("Verify Certificates")).toBeInTheDocument();
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

    expect(screen.getByText("Register Player")).toBeInTheDocument();
    expect(screen.getByText("Finish & Certify")).toBeInTheDocument();
  });
});
