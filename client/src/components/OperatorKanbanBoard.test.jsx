import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OperatorKanbanBoard from "./OperatorKanbanBoard";

describe("OperatorKanbanBoard Component", () => {
  it("renders 3 workflow columns", () => {
    render(<OperatorKanbanBoard orders={[]} />);
    expect(screen.getByText("Intake & Sorting")).toBeInTheDocument();
    expect(screen.getByText("Washing & Processing")).toBeInTheDocument();
    expect(screen.getByText("Ready for Dispatch")).toBeInTheDocument();
  });

  it("renders order card in appropriate column", () => {
    const mockOrders = [
      {
        id: "order-101-uuid",
        service_type: "Wash & Fold",
        status: "Sorting",
        weight_kg: 5.0,
      },
    ];
    render(<OperatorKanbanBoard orders={mockOrders} />);
    expect(screen.getByText("#order-10")).toBeInTheDocument();
  });
});
