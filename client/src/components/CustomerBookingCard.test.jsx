import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomerBookingCard from "./CustomerBookingCard";

describe("CustomerBookingCard Component", () => {
  it("renders booking form header and service options", () => {
    render(<CustomerBookingCard />);
    expect(screen.getByText("Schedule Laundry Pickup")).toBeInTheDocument();
    expect(screen.getByText("Wash & Fold")).toBeInTheDocument();
    expect(screen.getByText("Dry Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Ironing Only")).toBeInTheDocument();
  });

  it("allows service selection and submit click", () => {
    const mockOnCreated = vi.fn();
    render(<CustomerBookingCard onOrderCreated={mockOnCreated} />);

    const dryCleaningBtn = screen.getByText("Dry Cleaning");
    fireEvent.click(dryCleaningBtn);

    const submitBtn = screen.getByRole("button", {
      name: /Confirm & Schedule Pickup/i,
    });
    expect(submitBtn).toBeInTheDocument();
  });
});
