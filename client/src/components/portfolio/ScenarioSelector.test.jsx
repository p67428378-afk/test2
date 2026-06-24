import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScenarioSelector from "./ScenarioSelector";

describe("ScenarioSelector", () => {
  const mockScenarios = [
    {
      id: "1",
      name: "Balanced",
      casa_growth: "Moderate",
      npa_risk_movement: "Stable",
      roa_impact: "+1.2%",
    },
    {
      id: "2",
      name: "Aggressive",
      casa_growth: "High",
      npa_risk_movement: "Increasing",
      roa_impact: "+2.5%",
    },
  ];

  it("renders loading state correctly", () => {
    render(
      <ScenarioSelector
        scenarios={null}
        selectedScenarioId={null}
        onSelectScenario={() => {}}
        loading={true}
      />,
    );
    expect(screen.getByTestId("scenarios-loading")).toBeInTheDocument();
  });

  it("renders scenarios and handles selection", () => {
    const handleSelect = vi.fn();
    render(
      <ScenarioSelector
        scenarios={mockScenarios}
        selectedScenarioId="1"
        onSelectScenario={handleSelect}
        loading={false}
      />,
    );

    expect(screen.getByText("Balanced Scenario")).toBeInTheDocument();
    expect(screen.getByText("Aggressive Scenario")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("scenario-card-Aggressive"));
    expect(handleSelect).toHaveBeenCalledWith("2");
  });
});
