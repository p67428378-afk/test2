import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ComponentsTable from "./ComponentsTable.jsx";

describe("ComponentsTable Component", () => {
  const mockComponents = [
    {
      id: "1",
      name: "Thruster Valve TV-402",
      description: "Main thruster valve",
      location: "Bay 4",
      status: "Available",
      inventory_count: 12,
      next_inspection: "2026-08-01",
      next_calibration: "2026-09-01",
      flagged_for_review: false,
      supervisor_approved: false,
    },
  ];

  it("renders components list correctly", () => {
    render(
      <ComponentsTable
        components={mockComponents}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onViewDetails={vi.fn()}
        userRole="Engineer"
      />,
    );

    expect(screen.getByText("Thruster Valve TV-402")).toBeInTheDocument();
    expect(screen.getByText("Bay 4")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });
});
