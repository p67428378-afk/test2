import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BookingForm from "./BookingForm.jsx";

describe("BookingForm Component", () => {
  it("renders booking details form fields", () => {
    render(
      <BookingForm
        selectedDateTime="2026-06-15T14:00:00Z"
        onBookingSuccess={vi.fn()}
      />,
    );

    // Check if form fields are present
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Session Type")).toBeInTheDocument();
  });
});
