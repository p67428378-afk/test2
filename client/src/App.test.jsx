import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock API calls so App renders cleanly without network errors
vi.mock("./services/api", () => ({
  getExpenseSummary: vi.fn().mockResolvedValue({
    total_expense: 145.5,
    start_date: null,
    end_date: null,
    by_category: [
      {
        category_id: "cat-1",
        category_name: "Food",
        total_amount: 95.5,
        percentage: 65.6,
      },
    ],
  }),
  getExpenses: vi.fn().mockResolvedValue({
    total: 1,
    skip: 0,
    limit: 20,
    items: [
      {
        id: "exp-1",
        amount: 45.0,
        date: "2026-08-18",
        category_id: "cat-1",
        category_name: "Food",
        payment_method: "Credit Card",
        description: "Groceries",
      },
    ],
  }),
  getCategories: vi
    .fn()
    .mockResolvedValue([
      { id: "cat-1", name: "Food", description: "Food & Dining" },
    ]),
  createExpense: vi.fn().mockResolvedValue({ id: "exp-2" }),
  deleteExpense: vi.fn().mockResolvedValue({}),
}));

describe("App Component", () => {
  it("renders application header brand", async () => {
    render(<App />);
    const brandElement = await screen.findByText("ExpenseTracker");
    expect(brandElement).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<App />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });
});
