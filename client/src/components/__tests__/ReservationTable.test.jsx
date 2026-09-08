import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReservationTable from "../ReservationTable.jsx";

describe("ReservationTable Component", () => {
  const mockReservations = [
    {
      id: "res-1",
      guest: {
        full_name: "Alice Wonder",
        email: "alice@example.com",
        phone: "123-456",
      },
      room_type: "Single Deluxe",
      start_date: "2026-09-10",
      end_date: "2026-09-12",
      room: { room_number: "101" },
      status: "CONFIRMED",
    },
  ];

  it("renders reservation row data correctly", () => {
    render(
      <ReservationTable
        reservations={mockReservations}
        isLoading={false}
        onCheckIn={vi.fn()}
        onCheckOut={vi.fn()}
        onCancel={vi.fn()}
        onViewInvoice={vi.fn()}
      />,
    );

    expect(screen.getByText(/Alice Wonder/i)).toBeInTheDocument();
    expect(screen.getByText(/alice@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Single Deluxe/i)).toBeInTheDocument();
    expect(screen.getByText(/Check-In/i)).toBeInTheDocument();
  });

  it("shows empty state when no reservations present", () => {
    render(<ReservationTable reservations={[]} isLoading={false} />);

    expect(screen.getByText(/No Reservations Found/i)).toBeInTheDocument();
  });
});
