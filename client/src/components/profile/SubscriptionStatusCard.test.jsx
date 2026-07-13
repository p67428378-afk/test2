import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SubscriptionStatusCard from "./SubscriptionStatusCard";

describe("SubscriptionStatusCard Component", () => {
  const mockSubscription = {
    id: "sub-123",
    box_size: "Medium",
    frequency_weeks: 4,
    status: "active",
    next_payment_date: "2026-08-15T12:00:00Z",
    skip_next: false,
  };

  it("renders active subscription details", () => {
    render(
      <SubscriptionStatusCard
        subscription={mockSubscription}
        onUpdate={() => {}}
        loading={false}
      />,
    );

    expect(
      screen.getByText("The Connoisseur (24 Chocolates)"),
    ).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    expect(screen.getByText(/Every 4 weeks/i)).toBeInTheDocument();
  });

  it("calls onUpdate when pause button is clicked", () => {
    const handleUpdate = vi.fn();
    render(
      <SubscriptionStatusCard
        subscription={mockSubscription}
        onUpdate={handleUpdate}
        loading={false}
      />,
    );

    const pauseButton = screen.getByRole("button", {
      name: /Pause Subscription/i,
    });
    fireEvent.click(pauseButton);

    expect(handleUpdate).toHaveBeenCalledWith("paused");
  });
});
