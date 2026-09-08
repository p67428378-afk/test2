import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StatCard from "../components/StatCard";
import BudgetAlertBanner from "../components/BudgetAlertBanner";
import FilterToolbar from "../components/FilterToolbar";
import TransactionTable from "../components/TransactionTable";
import SetBudgetModal from "../components/SetBudgetModal";
import LogTransactionModal from "../components/LogTransactionModal";
import {
  authApi,
  expenseApi,
  categoryApi,
  budgetApi,
  reportApi,
} from "../services/api";

describe("FinTrack Pro Component Suite", () => {
  describe("StatCard", () => {
    it("renders title and formatted value correctly", () => {
      render(
        <StatCard
          title="Total Income"
          value="+$5,000.00"
          variant="income"
          subtitle="All earnings"
        />,
      );

      expect(screen.getByText("Total Income")).toBeInTheDocument();
      expect(screen.getByText("+$5,000.00")).toBeInTheDocument();
      expect(screen.getByText("All earnings")).toBeInTheDocument();
    });
  });

  describe("BudgetAlertBanner", () => {
    it("renders warning and breached alert indicators", () => {
      const mockBudgets = [
        {
          id: "b1",
          category_id: "c1",
          category_name: "Food & Dining",
          monthly_limit: 500,
          month: "2026-05",
          spent: 420,
          percentage: 84.0,
          alert_level: "WARNING",
        },
        {
          id: "b2",
          category_id: "c2",
          category_name: "Entertainment",
          monthly_limit: 200,
          month: "2026-05",
          spent: 210,
          percentage: 105.0,
          alert_level: "BREACHED",
        },
      ];

      render(
        <BrowserRouter>
          <BudgetAlertBanner budgets={mockBudgets} />
        </BrowserRouter>,
      );

      expect(screen.getByText(/WARNING/i)).toBeInTheDocument();
      expect(screen.getByText(/BREACHED/i)).toBeInTheDocument();
      expect(screen.getByText(/'Food & Dining'/i)).toBeInTheDocument();
      expect(screen.getByText(/'Entertainment'/i)).toBeInTheDocument();
    });

    it("returns null when no budgets exceed threshold", () => {
      const normalBudgets = [
        {
          id: "b1",
          category_name: "Utilities",
          monthly_limit: 300,
          spent: 100,
          percentage: 33.3,
          alert_level: "NORMAL",
        },
      ];

      const { container } = render(
        <BrowserRouter>
          <BudgetAlertBanner budgets={normalBudgets} />
        </BrowserRouter>,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("FilterToolbar", () => {
    it("renders search input and category selection controls", () => {
      const mockCategories = [
        { id: "1", name: "Food", type: "Expense" },
        { id: "2", name: "Salary", type: "Income" },
      ];

      render(
        <FilterToolbar
          search=""
          onSearchChange={() => {}}
          categoryId=""
          onCategoryChange={() => {}}
          transactionType=""
          onTypeChange={() => {}}
          paymentMethod=""
          onPaymentMethodChange={() => {}}
          startDate=""
          onStartDateChange={() => {}}
          endDate=""
          onEndDateChange={() => {}}
          categories={mockCategories}
          onOpenLogModal={() => {}}
        />,
      );

      expect(
        screen.getByPlaceholderText(/search description/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/All Categories/i)).toBeInTheDocument();
      expect(screen.getByText(/All Types/i)).toBeInTheDocument();
      expect(screen.getByText(/All Methods/i)).toBeInTheDocument();
      expect(screen.getByText(/Log Transaction/i)).toBeInTheDocument();
    });
  });

  describe("TransactionTable", () => {
    it("renders empty state when no transactions exist", () => {
      render(
        <TransactionTable
          transactions={[]}
          total={0}
          skip={0}
          limit={10}
          onPageChange={() => {}}
        />,
      );

      expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
    });

    it("renders transaction rows with amounts and type pills", () => {
      const mockTx = [
        {
          id: "tx1",
          amount: 45.5,
          date: "2026-05-18",
          transaction_type: "Expense",
          category: { id: "c1", name: "Food", type: "Expense" },
          payment_method: "Credit Card",
          description: "Lunch meeting",
          receipt_url: null,
        },
        {
          id: "tx2",
          amount: 3000,
          date: "2026-05-01",
          transaction_type: "Income",
          category: { id: "c2", name: "Salary", type: "Income" },
          payment_method: "Bank Transfer",
          description: "Monthly salary",
          receipt_url: null,
        },
      ];

      render(
        <TransactionTable
          transactions={mockTx}
          total={2}
          skip={0}
          limit={10}
          onPageChange={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />,
      );

      expect(screen.getByText("Lunch meeting")).toBeInTheDocument();
      expect(screen.getByText("Monthly salary")).toBeInTheDocument();
      expect(screen.getByText("-$45.50")).toBeInTheDocument();
      expect(screen.getByText("+$3,000.00")).toBeInTheDocument();
    });
  });

  describe("LogTransactionModal", () => {
    it("renders form inputs for adding new transaction", () => {
      const mockCategories = [{ id: "1", name: "Food", type: "Expense" }];

      render(
        <LogTransactionModal
          isOpen={true}
          onClose={() => {}}
          onSubmit={() => {}}
          categories={mockCategories}
        />,
      );

      expect(screen.getByText(/Log New Transaction/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
      expect(screen.getByText(/Add Transaction/i)).toBeInTheDocument();
    });
  });

  describe("SetBudgetModal", () => {
    it("renders budget configuration modal", () => {
      const mockCategories = [{ id: "1", name: "Food", type: "Expense" }];

      render(
        <SetBudgetModal
          isOpen={true}
          onClose={() => {}}
          onSubmit={() => {}}
          categories={mockCategories}
          defaultMonth="2026-05"
        />,
      );

      expect(screen.getByText(/Set Monthly Budget/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("500.00")).toBeInTheDocument();
      expect(screen.getByText(/Save Budget/i)).toBeInTheDocument();
    });
  });

  describe("API Service Contracts", () => {
    it("exports all expected API service methods", () => {
      expect(typeof authApi.login).toBe("function");
      expect(typeof authApi.register).toBe("function");
      expect(typeof authApi.getMe).toBe("function");
      expect(typeof expenseApi.getExpenses).toBe("function");
      expect(typeof expenseApi.createExpense).toBe("function");
      expect(typeof categoryApi.getCategories).toBe("function");
      expect(typeof budgetApi.getBudgets).toBe("function");
      expect(typeof budgetApi.setBudget).toBe("function");
      expect(typeof reportApi.getSummary).toBe("function");
      expect(typeof reportApi.exportReport).toBe("function");
    });
  });
});
