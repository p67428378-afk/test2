import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OrderSummaryCard from "./OrderSummaryCard";

const mockItems = [
  {
    id: "item-1",
    quantity: 2,
    item_subtotal: 24.0,
    chocolate: {
      id: "choc-1",
      title: "Madagascar 72%",
      price: 12.0,
      is_heat_sensitive: true,
    },
  },
  {
    id: "item-2",
    quantity: 1,
    item_subtotal: 35.0,
    chocolate: {
      id: "choc-2",
      title: "Exotic Truffles",
      price: 35.0,
      is_heat_sensitive: true,
    },
  },
];

describe("OrderSummaryCard Component", () => {
  it("renders correct subtotal, shipping fee, tax, and total amount", () => {
    const subtotal = 59.0;
    const shippingFee = 15.0;
    const taxRate = 0.05; // 2.95 tax -> 76.95 grand total

    render(
      <OrderSummaryCard
        items={mockItems}
        subtotal={subtotal}
        shippingMethod="express_thermal"
        shippingFee={shippingFee}
        taxRate={taxRate}
      />,
    );

    expect(screen.getByText("Order Summary (2 items)")).toBeInTheDocument();
    expect(screen.getByText("$59.00")).toBeInTheDocument();
    expect(screen.getByText("$15.00")).toBeInTheDocument();
    expect(screen.getByText("$2.95")).toBeInTheDocument();
    expect(screen.getByText("$76.95")).toBeInTheDocument();
  });
});
