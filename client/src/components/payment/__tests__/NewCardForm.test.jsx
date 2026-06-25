import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NewCardForm from "../NewCardForm.jsx";

describe("NewCardForm", () => {
  it("renders form fields correctly", () => {
    render(<NewCardForm isLoggedIn={true} onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText("Jane Doe")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("4111 1111 1111 1111"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MM/YY")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("***")).toBeInTheDocument();
    expect(
      screen.getByText("Save this card for future use"),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields on submit", () => {
    render(<NewCardForm isLoggedIn={true} onSubmit={vi.fn()} />);
    const submitButton = screen.getByRole("button", {
      name: /Submit Payment Details/i,
    });
    fireEvent.click(submitButton);

    expect(screen.getByText("Cardholder name is required")).toBeInTheDocument();
    expect(
      screen.getByText("Card number must be exactly 16 digits"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Expiry date must be in MM/YY format"),
    ).toBeInTheDocument();
    expect(screen.getByText("CVV must be 3 or 4 digits")).toBeInTheDocument();
  });

  it("calls onSubmit with correct data when form is valid", () => {
    const onSubmit = vi.fn();
    render(<NewCardForm isLoggedIn={true} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("Jane Doe"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("4111 1111 1111 1111"), {
      target: { value: "4111111111111111" },
    });
    fireEvent.change(screen.getByPlaceholderText("MM/YY"), {
      target: { value: "12/28" },
    });
    fireEvent.change(screen.getByPlaceholderText("***"), {
      target: { value: "123" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Submit Payment Details/i,
    });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        cardholderName: "Jane Doe",
        cardNumber: "4111111111111111",
        cardBrand: "Visa",
        cardExpiryDate: "2028-12-01",
        cardLastFour: "1111",
        cvv: "123",
        saveCard: true,
      }),
    );
  });
});
