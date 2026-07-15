import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import InlineConfirmation from "./InlineConfirmation.jsx";

describe("InlineConfirmation Component", () => {
  const mockPlan = {
    id: "plan-123",
    scenario_name: "Balanced",
    submitted_by: "manager@dollargeneral.com",
    created_at: "2026-07-15T10:30:00.000Z",
    audit_trail_id: "AP-98231-STV",
  };

  it("renders plan details correctly", () => {
    render(<InlineConfirmation plan={mockPlan} onClose={vi.fn()} />);
    expect(
      screen.getByText(/Success! Assortment Plan Submitted Successfully./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Balanced/i)).toBeInTheDocument();
    expect(screen.getByText(/manager@dollargeneral.com/i)).toBeInTheDocument();
    expect(screen.getByText(/ID: plan-123/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Audit Trail ID: AP-98231-STV/i),
    ).toBeInTheDocument();
  });

  it("calls onClose when Dismiss button is clicked", () => {
    const handleClose = vi.fn();
    render(<InlineConfirmation plan={mockPlan} onClose={handleClose} />);
    const button = screen.getByRole("button", { name: /Dismiss/i });
    fireEvent.click(button);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
