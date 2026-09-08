import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import MetricCard from "./components/dashboard/MetricCard";
import CategoryBreakdown from "./components/dashboard/CategoryBreakdown";
import ExpenseFormModal from "./components/expenses/ExpenseFormModal";

// Mock API calls
vi.mock("./services/api", () => ({
  getDashboardSummary: vi.fn(() =>
    Promise.resolve({
      total_expenses: 1250.5,
      total_count: 5,
      monthly_average: 416.83,
      top_category: "Food & Dining",
      expense_count: 5,
      by_category: [
        {
          category: "Food & Dining",
          total_amount: 450.0,
          count: 2,
          percentage: 36.0,
        },
        {
          category: "Housing & Utilities",
          total_amount: 800.5,
          count: 3,
          percentage: 64.0,
        },
      ],
      category_breakdown: [
        {
          category: "Food & Dining",
          total_amount: 450.0,
          count: 2,
          percentage: 36.0,
        },
        {
          category: "Housing & Utilities",
          total_amount: 800.5,
          count: 3,
          percentage: 64.0,
        },
      ],
    }),
  ),
  getExpenses: vi.fn(() =>
    Promise.resolve([
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        amount: 45.5,
        category: "Food & Dining",
        date: "2026-05-18",
        description: "Grocery shopping",
        created_at: "2026-05-18T10:00:00Z",
        updated_at: "2026-05-18T10:00:00Z",
      },
    ]),
  ),
  createExpense: vi.fn(() =>
    Promise.resolve({
      id: "123e4567-e89b-12d3-a456-426614174001",
      amount: 100,
      category: "Utilities",
      date: "2026-05-18",
      description: "Electric bill",
      created_at: "2026-05-18T10:00:00Z",
      updated_at: "2026-05-18T10:00:00Z",
    }),
  ),
  updateExpense: vi.fn(() => Promise.resolve({})),
  deleteExpense: vi.fn(() => Promise.resolve({})),
}));

describe("Expense Tracker Application Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main App title and navbar", async () => {
    render(<App />);
    const appTitles = screen.getAllByText("ExpenseTracker");
    expect(appTitles.length).toBeGreaterThan(0);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it("renders MetricCard component correctly", () => {
    render(
      <MetricCard
        title="Total Cumulative Expenses"
        value="$1,250.50"
        subtitle="All time total"
      />,
    );
    expect(screen.getByText("Total Cumulative Expenses")).toBeInTheDocument();
    expect(screen.getByText("$1,250.50")).toBeInTheDocument();
    expect(screen.getByText("All time total")).toBeInTheDocument();
  });

  it("renders CategoryBreakdown with items", () => {
    const breakdown = [
      {
        category: "Food & Dining",
        total_amount: 450.0,
        count: 2,
        percentage: 36.0,
      },
    ];
    render(<CategoryBreakdown breakdown={breakdown} totalExpenses={450.0} />);
    expect(screen.getByText("Expenses by Category")).toBeInTheDocument();
    expect(screen.getByText("Food & Dining")).toBeInTheDocument();
    expect(screen.getByText("$450.00")).toBeInTheDocument();
  });

  it("opens and closes ExpenseFormModal", () => {
    const handleClose = vi.fn();
    const handleSubmit = vi.fn();
    const { rerender } = render(
      <ExpenseFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />,
    );

    expect(screen.getByText("Add New Expense")).toBeInTheDocument();

    const closeBtn = screen.getByLabelText("Close modal");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it("navigates to Expenses tab when Expenses nav link is clicked", async () => {
    render(<App />);
    const expensesNavBtn = screen.getByRole("button", { name: /Expenses/i });
    fireEvent.click(expensesNavBtn);

    await waitFor(() => {
      expect(screen.getByText("Expenses Directory")).toBeInTheDocument();
    });
  });
});
