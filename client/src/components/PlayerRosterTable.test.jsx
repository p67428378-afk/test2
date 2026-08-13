import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PlayerRosterTable from "./PlayerRosterTable";

describe("PlayerRosterTable Component", () => {
  const samplePlayers = [
    {
      id: "p1",
      full_name: "Garry Kasparov",
      email: "garry@example.com",
      rating: 2800,
      fide_id: "100001",
      status: "ACTIVE",
    },
    {
      id: "p2",
      full_name: "Anatoly Karpov",
      email: "garry2@example.com",
      rating: 2750,
      fide_id: "100002",
      status: "ACTIVE",
    },
  ];

  it("renders player roster rows", () => {
    render(<PlayerRosterTable players={samplePlayers} />);

    expect(screen.getByText("Garry Kasparov")).toBeInView();
    expect(screen.getByText("Anatoly Karpov")).toBeInView();
    expect(screen.getByText("2800")).toBeInView();
    expect(screen.getByText("2750")).toBeInView();
  });

  it("renders empty state when roster is empty", () => {
    render(<PlayerRosterTable players={[]} />);

    expect(screen.getByText("No players registered yet.")).toBeInView();
  });
});
