import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BillingHistoryTable from "./BillingHistoryTable";

describe("BillingHistoryTable Component", () => {
  const mockHistory = [
    {
      id: "order-1",
      amount: 40.5,
      payment_date: "2026-07-10T11:00:00Z",
      status: "Paid",
    },
    {
      id: "order-2",
      amount: 40.5,
      payment_date: "2026-06-10T11:00:00Z",
      status: "Frozen",
    },
  ];

  it("renders billing history rows correctly", () => {
    render(<BillingHistoryTable billingHistory={mockHistory} />);

    expect(screen.getByText("order-1")).toBeInTheDocument();
    expect(screen.getByText("order-2")).toBeInTheDocument();
    expect(screen.getAllByText("$40.50")).toHaveLength(2);
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Frozen")).toBeInTheDocument();
  });

  it("renders empty state when no history is provided", () => {
    render(<BillingHistoryTable billingHistory={[]} />);
    expect(
      screen.getByText("No billing history available yet."),
    ).toBeInTheDocument();
  });
});
