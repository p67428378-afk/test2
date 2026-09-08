import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CheckInForm from "../CheckInForm.jsx";

describe("CheckInForm Component", () => {
  const mockReservation = {
    id: "res-12345678",
    guest: { full_name: "Bob Marley" },
    room_type: "Double Suite",
    start_date: "2026-09-10",
    end_date: "2026-09-15",
  };

  const mockRooms = [
    {
      id: "room-1",
      room_number: "102",
      room_type: "Double Suite",
      daily_rate: 220.0,
    },
  ];

  it("renders guest arrival details and submits check-in", () => {
    const handleConfirm = vi.fn();
    render(
      <CheckInForm
        reservation={mockReservation}
        availableRooms={mockRooms}
        onConfirmCheckIn={handleConfirm}
      />,
    );

    expect(screen.getByText(/Bob Marley/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Double Suite/i).length).toBeGreaterThan(0);

    // Check government ID checkbox
    const idCheckbox = screen.getByLabelText(/Government Issued Photo ID/i);
    fireEvent.click(idCheckbox);

    // Submit form
    const submitBtn = screen.getByRole("button", {
      name: /Confirm Check-In/i,
    });
    fireEvent.click(submitBtn);

    expect(handleConfirm).toHaveBeenCalledWith("res-12345678", "room-1");
  });
});
