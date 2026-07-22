import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AssignmentForm from "./AssignmentForm.jsx";

describe("AssignmentForm Component", () => {
  const mockComponents = [
    { id: "1", name: "Thruster Valve TV-402", status: "Available" },
  ];
  const mockMissions = [{ id: "101", name: "Artemis III", status: "Planning" }];

  it("renders form fields correctly", () => {
    render(
      <AssignmentForm
        components={mockComponents}
        missions={mockMissions}
        onAssignmentSuccess={vi.fn()}
      />,
    );

    expect(screen.getByText("Assign Equipment to Mission")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Mission")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Component")).toBeInTheDocument();
  });
});
