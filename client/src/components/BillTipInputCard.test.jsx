// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BillTipInputCard from "./BillTipInputCard.jsx";

describe("BillTipInputCard Component", () => {
  const defaultProps = {
    billAmount: 120,
    setBillAmount: vi.fn(),
    tipPercentage: 15,
    setTipPercentage: vi.fn(),
    isCustomTip: false,
    setIsCustomTip: vi.fn(),
    numPeople: 2,
    setNumPeople: vi.fn(),
    onCalculate: vi.fn(),
    onReset: vi.fn(),
    loading: false,
    error: "",
  };

  it("renders input fields and preset buttons", () => {
    render(<BillTipInputCard {...defaultProps} />);

    expect(screen.getByLabelText("Bill Amount in USD")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("15%")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByLabelText("Custom Tip Percentage")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Number of people splitting the bill"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Calculate Tip/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reset All/i }),
    ).toBeInTheDocument();
  });

  it("calls onCalculate when submit button is clicked", () => {
    render(<BillTipInputCard {...defaultProps} />);
    const calculateBtn = screen.getByRole("button", { name: /Calculate Tip/i });
    fireEvent.click(calculateBtn);
    expect(defaultProps.onCalculate).toHaveBeenCalled();
  });

  it("displays error message if error prop is provided", () => {
    render(
      <BillTipInputCard
        {...defaultProps}
        error="Bill amount must be greater than 0"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Bill amount must be greater than 0",
    );
  });
});
