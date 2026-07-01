import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScenarioSelectorSection from "./ScenarioSelectorSection.jsx";

describe("ScenarioSelectorSection Component", () => {
  const mockSetSelectedScenario = vi.fn();

  const mockScenariosData = {
    conservative: {
      projected_sales_impact_pct: 1.5,
      projected_private_brand_pct: 21.0,
      projected_shelf_capacity_pct: 85.0,
    },
    balanced: {
      projected_sales_impact_pct: 4.2,
      projected_private_brand_pct: 23.5,
      projected_shelf_capacity_pct: 91.0,
    },
    aggressive: {
      projected_sales_impact_pct: 6.8,
      projected_private_brand_pct: 26.0,
      projected_shelf_capacity_pct: 96.0,
    },
  };

  it("renders all scenarios with their descriptions", () => {
    render(
      <ScenarioSelectorSection
        selectedScenario="balanced"
        setSelectedScenario={mockSetSelectedScenario}
        scenariosData={mockScenariosData}
      />,
    );

    expect(screen.getByText("Conservative")).toBeInTheDocument();
    expect(screen.getByText("Balanced")).toBeInTheDocument();
    expect(screen.getByText("Aggressive")).toBeInTheDocument();

    expect(
      screen.getByText("Focus on core SKUs. Low risk."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mix of core growth and testing new items."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Maximize private label penetration. High risk."),
    ).toBeInTheDocument();
  });

  it("displays projected metrics when data is available", () => {
    render(
      <ScenarioSelectorSection
        selectedScenario="balanced"
        setSelectedScenario={mockSetSelectedScenario}
        scenariosData={mockScenariosData}
      />,
    );

    // Balanced metrics
    expect(screen.getByText("+4.2%")).toBeInTheDocument();
    expect(screen.getByText("23.5%")).toBeInTheDocument();
    expect(screen.getByText("91.0%")).toBeInTheDocument();
  });

  it("calls setSelectedScenario when a scenario card is clicked", () => {
    render(
      <ScenarioSelectorSection
        selectedScenario="balanced"
        setSelectedScenario={mockSetSelectedScenario}
        scenariosData={mockScenariosData}
      />,
    );

    fireEvent.click(screen.getByText("Conservative"));
    expect(mockSetSelectedScenario).toHaveBeenCalledWith("conservative");
  });

  it("handles empty or missing scenariosData gracefully without crashing", () => {
    // Test with empty object
    const { rerender } = render(
      <ScenarioSelectorSection
        selectedScenario="balanced"
        setSelectedScenario={mockSetSelectedScenario}
        scenariosData={{}}
      />,
    );

    expect(screen.getByText("Conservative")).toBeInTheDocument();

    // Test with null/undefined properties inside scenariosData
    const incompleteData = {
      conservative: {},
      balanced: {
        projected_sales_impact_pct: undefined,
      },
    };

    rerender(
      <ScenarioSelectorSection
        selectedScenario="balanced"
        setSelectedScenario={mockSetSelectedScenario}
        scenariosData={incompleteData}
      />,
    );

    expect(screen.getByText("Conservative")).toBeInTheDocument();
  });
});
