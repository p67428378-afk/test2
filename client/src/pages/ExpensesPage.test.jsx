import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import ExpensesPage from "./ExpensesPage";

vi.mock("../services/api", () => ({
  tournamentService: {
    getTournaments: vi.fn().mockResolvedValue([]),
  },
  expenseService: {
    getExpenses: vi.fn().mockResolvedValue([
      {
        id: "1",
        amount: 120.5,
        category: "Food & Dining",
        date: "2026-05-18",
        description: "Grocery store",
      },
    ]),
    createExpense: vi.fn(),
    updateExpense: vi.fn(),
    deleteExpense: vi.fn(),
    getDashboardSummary: vi.fn().mockResolvedValue({
      active_month: "2026-05",
      monthly_total: 120.5,
      total_expenses: 120.5,
      category_breakdown: [
        { category: "Food & Dining", amount: 120.5, percentage: 100.0 },
      ],
    }),
  },
}));

describe("ExpensesPage Component", () => {
  it("renders page title and filter toolbar", async () => {
    render(
      <BrowserRouter>
        <ExpensesPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Expense Tracker")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search description or category..."),
    ).toBeInTheDocument();
  });
});
