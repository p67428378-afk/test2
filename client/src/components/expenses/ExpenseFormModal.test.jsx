import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExpenseFormModal from "./ExpenseFormModal";

describe("ExpenseFormModal Component", () => {
  it("does not render when isOpen is false", () => {
    render(<ExpenseFormModal isOpen={false} />);
    expect(screen.queryByText("Add New Expense")).not.toBeInTheDocument();
  });

  it("renders Add New Expense modal when isOpen is true", () => {
    render(
      <ExpenseFormModal isOpen={true} onClose={() => {}} onSave={() => {}} />,
    );
    expect(screen.getByText("Add New Expense")).toBeInTheDocument();
  });

  it("shows validation error on empty or invalid amount submit", () => {
    const handleSave = vi.fn();
    render(
      <ExpenseFormModal isOpen={true} onClose={() => {}} onSave={handleSave} />,
    );

    const saveBtn = screen.getByRole("button", { name: /save expense/i });
    fireEvent.click(saveBtn);

    expect(
      screen.getByText("Amount must be a positive number."),
    ).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it("submits form successfully with valid inputs", () => {
    const handleSave = vi.fn();
    render(
      <ExpenseFormModal isOpen={true} onClose={() => {}} onSave={handleSave} />,
    );

    const amountInput = screen.getByPlaceholderText("0.00");
    fireEvent.change(amountInput, { target: { value: "85.50" } });

    const descInput = screen.getByPlaceholderText(/grocery shopping/i);
    fireEvent.change(descInput, { target: { value: "Dinner out" } });

    const saveBtn = screen.getByRole("button", { name: /save expense/i });
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledWith({
      amount: 85.5,
      category: "Food & Dining",
      date: expect.any(String),
      description: "Dinner out",
    });
  });
});
