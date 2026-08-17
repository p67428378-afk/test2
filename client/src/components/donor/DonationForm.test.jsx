import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DonationForm from "./DonationForm";

describe("DonationForm Component", () => {
  it("renders donation creation form fields correctly", () => {
    render(<DonationForm />);

    expect(screen.getByText(/Post Surplus Food Donation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Food Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preparation Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Storage Condition/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pickup Address/i)).toBeInTheDocument();
  });

  it("allows changing quantity input", () => {
    render(<DonationForm />);

    const quantityInput = screen.getByLabelText(/Quantity/i);
    fireEvent.change(quantityInput, { target: { value: "25" } });

    expect(quantityInput.value).toBe("25");
  });
});
