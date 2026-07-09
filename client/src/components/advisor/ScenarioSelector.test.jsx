import { render, screen } from "@testing-library/react";
import React from "react";
import { expect, test } from "vitest";
import ScenarioSelector from "./ScenarioSelector.jsx";

test("renders ScenarioSelector and displays Holiday Lift % for Aggressive scenario", () => {
  const projections = {
    Conservative: {
      scenario_type: "Conservative",
      projected_sales_lift: 0.5,
      projected_private_brand_pct: 23.0,
    },
    Balanced: {
      scenario_type: "Balanced",
      projected_sales_lift: 2.0,
      projected_private_brand_pct: 25.0,
    },
    Aggressive: {
      scenario_type: "Aggressive",
      projected_sales_lift: 4.5,
      projected_private_brand_pct: 28.0,
      holiday_lift_pct: 12.5,
    },
  };

  render(
    <ScenarioSelector
      selectedScenario="Balanced"
      onSelect={() => {}}
      projections={projections}
      loading={false}
    />,
  );

  // Check scenario titles
  expect(screen.getByText("Conservative Scenario")).toBeInTheDocument();
  expect(screen.getByText("Balanced Scenario")).toBeInTheDocument();
  expect(screen.getByText("Aggressive Scenario")).toBeInTheDocument();

  // Check Holiday Lift % is displayed for Aggressive scenario
  expect(screen.getByText(/Holiday Lift %:/i)).toBeInTheDocument();
  expect(screen.getByText("+12.5%")).toBeInTheDocument();
});
