import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScenarioSelector from "../ScenarioSelector";

describe("ScenarioSelector", () => {
  it("renders all three scenarios", () => {
    render(
      <ScenarioSelector
        selectedScenario="Balanced"
        onScenarioChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Conservative")).toBeInTheDocument();
    expect(screen.getByText("Balanced")).toBeInTheDocument();
    expect(screen.getByText("Aggressive")).toBeInTheDocument();
  });

  it("calls onScenarioChange when a scenario is clicked", () => {
    const handleScenarioChange = vi.fn();
    render(
      <ScenarioSelector
        selectedScenario="Balanced"
        onScenarioChange={handleScenarioChange}
      />,
    );

    fireEvent.click(screen.getByText("Conservative"));
    expect(handleScenarioChange).toHaveBeenCalledWith("Conservative");
  });
});
