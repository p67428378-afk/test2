import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomerBookingForm from "./CustomerBookingForm";

describe("CustomerBookingForm Component", () => {
  it("renders form inputs and submit button", () => {
    render(<CustomerBookingForm />);
    expect(screen.getByText(/Request Water Delivery/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Submit Delivery Request/i }),
    ).toBeInTheDocument();
  });

  it("validates operational hours inline", async () => {
    render(<CustomerBookingForm />);
    const addressInput = screen.getByLabelText(/Delivery Destination Address/i);
    fireEvent.change(addressInput, { target: { value: "123 Park Avenue" } });

    // Set time outside 6 AM - 10 PM (e.g. 2:00 AM)
    const timeInput = screen.getByLabelText(/Preferred Delivery Time Window/i);
    fireEvent.change(timeInput, { target: { value: "2026-08-15T02:00" } });

    const submitBtn = screen.getByRole("button", {
      name: /Submit Delivery Request/i,
    });
    fireEvent.click(submitBtn);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
