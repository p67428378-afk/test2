import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ScenarioSelector from "./ScenarioSelector.jsx";

describe("ScenarioSelector Component", () => {
  it("renders all three scenarios", () => {
    render(
      <ScenarioSelector
        selectedScenario="Balanced"
        onSelectScenario={vi.fn()}
      />,
    );
    expect(screen.getByText("Conservative")).toBeInTheDocument();
    expect(screen.getByText("Balanced")).toBeInTheDocument();
    expect(screen.getByText("Aggressive")).toBeInTheDocument();
  });

  it("calls onSelectScenario when a scenario card is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <ScenarioSelector
        selectedScenario="Balanced"
        onSelectScenario={handleSelect}
      />,
    );
    fireEvent.click(screen.getByText("Aggressive"));
    expect(handleSelect).toHaveBeenCalledWith("Aggressive");
  });
});
