import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ActiveDeliveryCard from "./ActiveDeliveryCard";

describe("ActiveDeliveryCard Component", () => {
  const mockDeliveries = [
    {
      id: "deliv-1234-5678",
      claim_id: "claim-1",
      status: "TASK_ACCEPTED",
      volunteer_id: "vol-1",
    },
  ];

  it("renders active delivery dispatch tasks", () => {
    render(<ActiveDeliveryCard deliveries={mockDeliveries} />);

    expect(
      screen.getByText(/Active Delivery Dispatch Tasks/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/TASK_ACCEPTED/i)).toBeInTheDocument();
  });

  it("renders empty state when no deliveries exist", () => {
    render(<ActiveDeliveryCard deliveries={[]} />);

    expect(
      screen.getByText(/No active delivery tasks assigned/i),
    ).toBeInTheDocument();
  });
});
