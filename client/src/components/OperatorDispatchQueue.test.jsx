import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OperatorDispatchQueue from "./OperatorDispatchQueue";

describe("OperatorDispatchQueue Component", () => {
  it("renders empty queue message when no pending bookings exist", () => {
    render(<OperatorDispatchQueue bookings={[]} />);
    expect(screen.getByText(/Dispatch Queue Clear/i)).toBeInTheDocument();
  });

  it("renders pending booking items and handles selection", () => {
    const mockBookings = [
      {
        id: "booking-1",
        delivery_address: "789 Sunset Blvd",
        volume_liters: 10000,
        status: "PENDING_ASSIGNMENT",
        scheduled_time: "2026-08-15T10:00:00Z",
      },
    ];

    const onSelectMock = vi.fn();
    render(
      <OperatorDispatchQueue
        bookings={mockBookings}
        onSelectBooking={onSelectMock}
      />,
    );

    expect(screen.getByText(/789 Sunset Blvd/i)).toBeInTheDocument();
    const assignBtn = screen.getByRole("button", { name: /Assign/i });
    fireEvent.click(assignBtn);
    expect(onSelectMock).toHaveBeenCalledWith(mockBookings[0]);
  });
});
