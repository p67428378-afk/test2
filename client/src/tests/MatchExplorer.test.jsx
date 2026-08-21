import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MatchExplorer from "../components/MatchExplorer.jsx";

describe("MatchExplorer component", () => {
  const mockMatches = [
    {
      partner_id: "partner-1",
      partner_name: "Alice Johnson",
      partner_email: "alice@example.com",
      teaches_skill: {
        user_skill_id: "uskill-1",
        skill_name: "React",
        proficiency: "EXPERT",
      },
      learns_skill: {
        user_skill_id: "uskill-2",
        skill_name: "Python",
        proficiency: "INTERMEDIATE",
      },
      is_reciprocal: true,
    },
  ];

  it("renders match cards with reciprocal badge", () => {
    render(
      <MatchExplorer
        matches={mockMatches}
        isLoading={false}
        onSearch={vi.fn()}
        onRequestExchange={vi.fn()}
      />,
    );

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Reciprocal")).toBeInTheDocument();
  });

  it("triggers onRequestExchange when clicking request button", () => {
    const handleRequest = vi.fn();
    render(
      <MatchExplorer
        matches={mockMatches}
        isLoading={false}
        onSearch={vi.fn()}
        onRequestExchange={handleRequest}
      />,
    );

    const btn = screen.getByRole("button", { name: /Request Skill Exchange/i });
    fireEvent.click(btn);

    expect(handleRequest).toHaveBeenCalledWith(mockMatches[0]);
  });
});
