import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RoomCard from "../RoomCard.jsx";

describe("RoomCard Component", () => {
  const mockRoom = {
    id: "room-101",
    room_number: "101",
    room_type: "Single Deluxe",
    daily_rate: 120.0,
    status: "Available",
  };

  it("renders room details correctly", () => {
    render(
      <RoomCard room={mockRoom} onStatusChange={vi.fn()} isUpdating={false} />,
    );
    expect(screen.getByText(/Room 101/i)).toBeInTheDocument();
    expect(screen.getByText(/Single Deluxe/i)).toBeInTheDocument();
    expect(screen.getByText(/120.00/i)).toBeInTheDocument();
  });

  it("calls onStatusChange when status select changes", () => {
    const handleStatusChange = vi.fn();
    render(
      <RoomCard
        room={mockRoom}
        onStatusChange={handleStatusChange}
        isUpdating={false}
      />,
    );
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Occupied" } });
    expect(handleStatusChange).toHaveBeenCalledWith("room-101", "Occupied");
  });
});
