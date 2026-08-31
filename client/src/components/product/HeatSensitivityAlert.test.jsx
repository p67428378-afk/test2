import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeatSensitivityAlert from "./HeatSensitivityAlert";

describe("HeatSensitivityAlert Component", () => {
  it("renders full heat advisory callout with temperature guidance", () => {
    render(<HeatSensitivityAlert compact={false} />);

    expect(
      screen.getByText(/Heat-Sensitive Item: Cold-pack shipping recommended/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/21°C \(70°F\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Protective foil insulation bag/i),
    ).toBeInTheDocument();
  });

  it("renders compact version when compact prop is true", () => {
    render(<HeatSensitivityAlert compact={true} />);

    expect(screen.getByTestId("heat-sensitivity-compact")).toBeInTheDocument();
  });
});
