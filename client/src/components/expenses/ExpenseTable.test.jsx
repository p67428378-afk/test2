import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExpenseTable from "./ExpenseTable";

describe("ExpenseTable Component", () => {
  const sampleExpenses = [
    {
      id: "1",
      amount: 120.5,
      category: "Food & Dining",
      date: "2026-05-18",
      description: "Trader Joe's Groceries",
    },
    {
      id: "2",
      amount: 145.0,
      category: "Housing & Utilities",
      date: "2026-05-15",
      description: "Electric Bill",
    },
  ];

  it("renders empty state when no expenses exist", () => {
    render(<ExpenseTable expenses={[]} selectedMonth="2026-05" />);
    expect(
      screen.getByText("No expenses found for 2026-05"),
    ).toBeInTheDocument();
  });

  it("renders expenses correctly in table rows", () => {
    render(<ExpenseTable expenses={sampleExpenses} />);
    expect(screen.getByText("Trader Joe's Groceries")).toBeInTheDocument();
    expect(screen.getByText("Electric Bill")).toBeInTheDocument();
    expect(screen.getByText("$120.50")).toBeInTheDocument();
    expect(screen.getByText("$145.00")).toBeInTheDocument();
  });

  it("triggers onEdit and onDelete handlers", () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <ExpenseTable
        expenses={sampleExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />,
    );

    const editBtns = screen.getAllByTitle("Edit Expense");
    fireEvent.click(editBtns[0]);
    expect(handleEdit).toHaveBeenCalledWith(sampleExpenses[0]);

    const deleteBtns = screen.getAllByTitle("Delete Expense");
    fireEvent.click(deleteBtns[0]);
    expect(handleDelete).toHaveBeenCalledWith("1");
  });
});
