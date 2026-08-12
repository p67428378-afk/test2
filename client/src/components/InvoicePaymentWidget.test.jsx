import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InvoicePaymentWidget from "./InvoicePaymentWidget";

describe("InvoicePaymentWidget Component", () => {
  it("renders fallback when no order is provided", () => {
    render(<InvoicePaymentWidget order={null} />);
    expect(
      screen.getByText("No active order for invoice payment."),
    ).toBeInTheDocument();
  });

  it("calculates total and displays payment status", () => {
    const mockOrder = {
      id: "ord-123",
      service_type: "Wash & Fold",
      weight_kg: 10.0,
      total_amount: 35.0,
      payment_status: "PAYMENT_PENDING",
    };

    render(<InvoicePaymentWidget order={mockOrder} />);
    expect(screen.getByText("Itemized Invoice Summary")).toBeInTheDocument();
    expect(screen.getByText("$35.00")).toBeInTheDocument();
    expect(screen.getByText("Pay Now via Stripe Checkout")).toBeInTheDocument();
  });
});
