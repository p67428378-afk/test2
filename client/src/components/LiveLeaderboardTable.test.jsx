import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LiveLeaderboardTable from "./LiveLeaderboardTable";

describe("LiveLeaderboardTable Component", () => {
  const sampleStandings = [
    {
      rank: 1,
      player_id: "p1",
      full_name: "Magnus Carlsen",
      rating: 2850,
      total_points: 3.5,
      buchholz: 12.0,
      sonneborn_berger: 8.5,
    },
    {
      rank: 2,
      player_id: "p2",
      full_name: "Hikaru Nakamura",
      rating: 2800,
      total_points: 3.0,
      buchholz: 11.5,
      sonneborn_berger: 7.0,
    },
  ];

  it("renders standings ranks and tie-break scores", () => {
    render(<LiveLeaderboardTable standings={sampleStandings} />);

    expect(screen.getByText("Magnus Carlsen")).toBeInView();
    expect(screen.getByText("Hikaru Nakamura")).toBeInView();
    expect(screen.getByText("3.5")).toBeInView();
    expect(screen.getByText("3.0")).toBeInView();
  });

  it("renders empty state when standings are empty", () => {
    render(<LiveLeaderboardTable standings={[]} />);

    expect(screen.getByText(/No standings available yet/i)).toBeInView();
  });
});
