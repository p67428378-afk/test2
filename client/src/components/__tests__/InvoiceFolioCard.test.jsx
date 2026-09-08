import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InvoiceFolioCard from "../InvoiceFolioCard.jsx";

describe("InvoiceFolioCard Component", () => {
  const mockInvoice = {
    id: "inv-12345678",
    reservation_id: "res-123",
    room_charges: 440.0,
    tax_amount: 44.0,
    service_fees: 20.0,
    discount_amount: 0.0,
    total_amount: 504.0,
    payment_status: "UNPAID",
    items: [
      {
        id: "it-1",
        description: "Room Charges (2 nights @ $220.00)",
        amount: 440.0,
      },
    ],
  };

  it("renders statement items and total due correctly", () => {
    render(
      <InvoiceFolioCard
        invoice={mockInvoice}
        onPay={vi.fn()}
        isPaying={false}
      />,
    );

    expect(screen.getByText(/Invoice #inv-1234/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$440.00/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/\$44.00/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$504.00/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /Settle & Pay/i }),
    ).toBeInTheDocument();
  });
});
