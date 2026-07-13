import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OrderSummaryCard from "./OrderSummaryCard";

describe("OrderSummaryCard Component", () => {
  it("renders correct details for Medium box size", () => {
    render(
      <OrderSummaryCard
        boxSize="Medium"
        frequencyWeeks={4}
        onComplete={() => {}}
        loading={false}
      />,
    );

    expect(screen.getByText("The Connoisseur")).toBeInTheDocument();
    expect(screen.getByText("Ships every 4 weeks")).toBeInTheDocument();
    expect(screen.getByText("$45.00")).toBeInTheDocument();
    expect(screen.getByText("-$4.50")).toBeInTheDocument();
    expect(screen.getByText("$40.50")).toBeInTheDocument();
  });

  it("calls onComplete when complete button is clicked", () => {
    const handleComplete = vi.fn();
    render(
      <OrderSummaryCard
        boxSize="Medium"
        frequencyWeeks={4}
        onComplete={handleComplete}
        loading={false}
      />,
    );

    const button = screen.getByRole("button", {
      name: /Complete Subscription/i,
    });
    fireEvent.click(button);

    expect(handleComplete).toHaveBeenCalled();
  });
});
