import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import * as api from "./services/api";
import Navbar from "./components/common/Navbar";
import StatCard from "./components/common/StatCard";
import Badge from "./components/common/Badge";
import Button from "./components/common/Button";
import ExpenseForm from "./components/expenses/ExpenseForm";
import BudgetProgressBar from "./components/budgets/BudgetProgressBar";
import { MemoryRouter } from "react-router-dom";

vi.mock("./services/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  formatApiError: vi.fn((e) => e?.message || "Error"),
  getCategories: vi.fn(),
  getExpenses: vi.fn(),
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
  getBudgets: vi.fn(),
  createOrUpdateBudget: vi.fn(),
  deleteBudget: vi.fn(),
  getAnalyticsSummary: vi.fn(),
  getCategoryBreakdown: vi.fn(),
  getMonthlyTrend: vi.fn(),
}));

describe("Expense Tracker Frontend Suite", () => {
  const mockCategories = [
    {
      id: "cat-1",
      name: "Food & Dining",
      color: "#2663eb",
      icon: "tag",
      is_default: true,
    },
    {
      id: "cat-2",
      name: "Transportation",
      color: "#17a34a",
      icon: "tag",
      is_default: false,
    },
  ];

  const mockExpenses = [
    {
      id: "exp-1",
      title: "Whole Foods Market",
      amount: 84.5,
      category_id: "cat-1",
      category_name: "Food & Dining",
      category_color: "#2663eb",
      expense_date: "2026-05-18",
      payment_method: "Credit Card",
      description: "Weekly groceries",
    },
  ];

  const mockSummary = {
    total_spent: 3420.5,
    monthly_budget_limit: 4500.0,
    remaining_balance: 1079.5,
    daily_average: 114.02,
    transaction_count: 30,
    categories_over_limit_count: 1,
    over_limit_categories: ["Food & Dining"],
  };

  const mockBudgets = [
    {
      id: "bud-1",
      category_id: "cat-1",
      category_name: "Food & Dining",
      category_color: "#2663eb",
      monthly_limit: 600.0,
      month: 5,
      year: 2026,
      total_spent: 650.0,
      remaining_balance: -50.0,
      utilization_percentage: 108.33,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getCategories.mockResolvedValue(mockCategories);
    api.getExpenses.mockResolvedValue(mockExpenses);
    api.getAnalyticsSummary.mockResolvedValue(mockSummary);
    api.getBudgets.mockResolvedValue(mockBudgets);
    api.getCategoryBreakdown.mockResolvedValue([
      {
        category_id: "cat-1",
        category_name: "Food & Dining",
        category_color: "#2663eb",
        total_amount: 650,
        percentage: 100,
        transaction_count: 5,
      },
    ]);
    api.getMonthlyTrend.mockResolvedValue([
      {
        month: 5,
        year: 2026,
        period: "May 2026",
        total_amount: 3420.5,
        budget_limit: 4500,
        transaction_count: 30,
      },
    ]);
  });

  it("renders Navbar with brand and navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.getByText("ExpenseFlow")).toBeInTheDocument();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Expenses").length).toBeGreaterThan(0);
  });

  it("renders StatCard and Badge components correctly", () => {
    render(
      <StatCard
        title="Total Spent"
        value="$3,420.50"
        badgeText="+4.2% vs last month"
        badgeVariant="success"
      />,
    );
    expect(screen.getByText("Total Spent")).toBeInTheDocument();
    expect(screen.getByText("$3,420.50")).toBeInTheDocument();
    expect(screen.getByText("+4.2% vs last month")).toBeInTheDocument();
  });

  it("renders Button component with variant styles and handles clicks", async () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Save Record
      </Button>,
    );
    const btn = screen.getByRole("button", { name: /save record/i });
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("validates ExpenseForm input before calling submit", async () => {
    const handleSubmit = vi.fn();
    render(<ExpenseForm categories={mockCategories} onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/Expense Title \/ Vendor/i);
    const amountInput = screen.getByLabelText(/Amount \(\$ USD\)/i);
    const saveButton = screen.getByRole("button", { name: /Save Expense/i });

    await userEvent.type(titleInput, "Starbucks Coffee");
    await userEvent.type(amountInput, "6.75");
    await userEvent.click(saveButton);

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Starbucks Coffee",
        amount: 6.75,
        category_id: "cat-1",
      }),
      expect.any(Function),
    );
  });

  it("renders BudgetProgressBar with correct overrun indicators", () => {
    render(<BudgetProgressBar budget={mockBudgets[0]} onDelete={vi.fn()} />);
    expect(screen.getByText("Food & Dining")).toBeInTheDocument();
    expect(screen.getByText(/Over Budget/i)).toBeInTheDocument();
  });

  it("mounts App and loads Dashboard view without throwing", async () => {
    render(<App />);
    expect(screen.getByText("ExpenseFlow")).toBeInTheDocument();
    await waitFor(() => {
      expect(api.getAnalyticsSummary).toHaveBeenCalled();
    });
  });
});
