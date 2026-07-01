import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Header from "./components/layout/Header";
import ModuleCard from "./components/dashboard/ModuleCard";
import BadgeCard from "./components/dashboard/BadgeCard";

describe("HealthQuest Components", () => {
  it("renders Header with user info and points", () => {
    const user = { username: "TestExplorer" };
    render(<Header user={user} points={350} onResetUser={() => {}} />);

    expect(screen.getByText("HealthQuest")).toBeInTheDocument();
    expect(screen.getByText("TestExplorer")).toBeInTheDocument();
    expect(screen.getByText("350 Points")).toBeInTheDocument();
  });

  it("renders ModuleCard with correct title and description", () => {
    const handlePlay = vi.fn();
    render(
      <ModuleCard
        title="Sort the Foods!"
        description="Help Chef Bunny sort healthy treats."
        icon="🍎"
        bgColor="#DCFCE7"
        borderColor="#86EFAC"
        textColor="#166534"
        btnColor="#22C55E"
        btnBorderColor="#15803d"
        btnText="Play Game"
        onPlay={handlePlay}
      />,
    );

    expect(screen.getByText("Sort the Foods!")).toBeInTheDocument();
    expect(
      screen.getByText("Help Chef Bunny sort healthy treats."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play Game" }),
    ).toBeInTheDocument();
  });

  it("renders BadgeCard as unlocked or locked", () => {
    const { rerender } = render(
      <BadgeCard
        name="Veggie Champion"
        icon="🥕"
        isUnlocked={true}
        requirement="Complete Nutrition to unlock!"
      />,
    );

    expect(screen.getByText("Veggie Champion")).toBeInTheDocument();
    expect(screen.getByText("Unlocked")).toBeInTheDocument();

    rerender(
      <BadgeCard
        name="Veggie Champion"
        icon="🥕"
        isUnlocked={false}
        requirement="Complete Nutrition to unlock!"
      />,
    );

    expect(
      screen.getByText("Complete Nutrition to unlock!"),
    ).toBeInTheDocument();
  });
});
