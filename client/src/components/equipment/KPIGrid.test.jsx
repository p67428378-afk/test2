import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KPIGrid from "./KPIGrid.jsx";

describe("KPIGrid Component", () => {
  it("renders KPI cards with correct values", () => {
    render(
      <KPIGrid
        totalComponents={1248}
        lowInventoryCount={3}
        expiredCertifications={5}
        activeMissions={4}
      />,
    );

    expect(screen.getByText("1248")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
