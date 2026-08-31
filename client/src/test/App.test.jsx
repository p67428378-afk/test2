import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import * as api from "../services/api";
import SplitTypeTabs from "../components/expenses/SplitTypeTabs";
import SettlementCard from "../components/settlements/SettlementCard";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseForm from "../components/expenses/ExpenseForm";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";

// Mock API service module
vi.mock("../services/api", () => ({
  getGroups: vi.fn(),
  getGroup: vi.fn(),
  createGroup: vi.fn(),
  getExpenses: vi.fn(),
  getExpense: vi.fn(),
  createExpense: vi.fn(),
  getGroupSettlements: vi.fn(),
  getHealth: vi.fn(),
}));

describe("Bill Splitter Frontend Suite", () => {
  const mockGroups = [
    {
      id: "grp-1",
      name: "NYC Trip",
      description: "Weekend in New York",
      total_spent: 300,
      member_count: 3,
      members: [
        { id: "mem-1", name: "Alice", email: "alice@example.com" },
        { id: "mem-2", name: "Bob", email: "bob@example.com" },
        { id: "mem-3", name: "Charlie", email: "charlie@example.com" },
      ],
    },
  ];

  const mockExpenses = [
    {
      id: "exp-1",
      group_id: "grp-1",
      title: "Dinner at Italian Bistro",
      total_amount: 120,
      payer_id: "mem-1",
      payer_name: "Alice",
      category: "Food & Dining",
      split_type: "EQUAL",
      expense_date: "2026-08-30T19:00:00Z",
      splits: [
        {
          id: "s-1",
          member_id: "mem-1",
          member_name: "Alice",
          split_value: 33.33,
          computed_amount: 40,
        },
        {
          id: "s-2",
          member_id: "mem-2",
          member_name: "Bob",
          split_value: 33.33,
          computed_amount: 40,
        },
        {
          id: "s-3",
          member_id: "mem-3",
          member_name: "Charlie",
          split_value: 33.34,
          computed_amount: 40,
        },
      ],
    },
  ];

  const mockSettlements = {
    group_id: "grp-1",
    balances: [
      { member_id: "mem-1", member_name: "Alice", net_balance: 80 },
      { member_id: "mem-2", member_name: "Bob", net_balance: -40 },
      { member_id: "mem-3", member_name: "Charlie", net_balance: -40 },
    ],
    settlements: [
      {
        from_member: "Bob",
        to_member: "Alice",
        amount: 40,
        from_member_id: "mem-2",
        to_member_id: "mem-1",
      },
      {
        from_member: "Charlie",
        to_member: "Alice",
        amount: 40,
        from_member_id: "mem-3",
        to_member_id: "mem-1",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.getGroups.mockResolvedValue(mockGroups);
    api.getGroup.mockResolvedValue(mockGroups[0]);
    api.getExpenses.mockResolvedValue(mockExpenses);
    api.getGroupSettlements.mockResolvedValue(mockSettlements);
  });

  it("renders application navigation and brand title", async () => {
    render(<App />);
    expect(screen.getAllByText(/BillSplitter/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Groups Overview/i)[0]).toBeInTheDocument();
  });

  describe("Common Components", () => {
    it("renders StatCard with title, value, and subtitle", () => {
      render(
        <StatCard
          title="Active Groups"
          value="3 Groups"
          subtitle="All active expense groups"
          color="blue"
        />,
      );
      expect(screen.getByText("Active Groups")).toBeInTheDocument();
      expect(screen.getByText("3 Groups")).toBeInTheDocument();
      expect(screen.getByText("All active expense groups")).toBeInTheDocument();
    });

    it("renders Badge with custom variant and text", () => {
      render(<Badge variant="success">Paid</Badge>);
      expect(screen.getByText("Paid")).toBeInTheDocument();
    });
  });

  describe("SplitTypeTabs Component", () => {
    it("renders all three split rules and fires onChange when selected", () => {
      const handleChange = vi.fn();
      render(<SplitTypeTabs splitType="EQUAL" onChange={handleChange} />);

      expect(screen.getByText("Split Equally")).toBeInTheDocument();
      expect(screen.getByText("By Percentage")).toBeInTheDocument();
      expect(screen.getByText("Fixed Amounts")).toBeInTheDocument();

      fireEvent.click(screen.getByText("By Percentage"));
      expect(handleChange).toHaveBeenCalledWith("PERCENTAGE");

      fireEvent.click(screen.getByText("Fixed Amounts"));
      expect(handleChange).toHaveBeenCalledWith("FIXED");
    });
  });

  describe("SettlementCard Component", () => {
    it("renders transfer details from debtor to creditor", () => {
      const settlement = {
        from_member: "Bob",
        to_member: "Alice",
        amount: 40.0,
      };
      render(<SettlementCard settlement={settlement} />);

      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("$40.00")).toBeInTheDocument();
      expect(screen.getByText(/Bob owes Alice/i)).toBeInTheDocument();
    });

    it("allows marking settlement as paid", () => {
      const handleSettle = vi.fn();
      const settlement = {
        from_member: "Charlie",
        to_member: "Alice",
        amount: 20.0,
      };
      render(
        <SettlementCard settlement={settlement} onSettle={handleSettle} />,
      );

      const markBtn = screen.getByRole("button", { name: /Mark as Paid/i });
      fireEvent.click(markBtn);

      expect(handleSettle).toHaveBeenCalledWith(settlement);
      expect(screen.getByText(/Settled/i)).toBeInTheDocument();
    });
  });

  describe("ExpenseTable Component", () => {
    it("renders expense list with columns and calculates share breakdown", () => {
      render(<ExpenseTable expenses={mockExpenses} />);

      expect(screen.getByText("Dinner at Italian Bistro")).toBeInTheDocument();
      expect(
        screen.getAllByText("Food & Dining").length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("$120.00")).toBeInTheDocument();
      expect(screen.getByText(/3 Shares/i)).toBeInTheDocument();
    });

    it("expands individual shares breakdown on toggle", () => {
      render(<ExpenseTable expenses={mockExpenses} />);

      const breakdownBtn = screen.getByRole("button", { name: /3 Shares/i });
      fireEvent.click(breakdownBtn);

      expect(
        screen.getByText("Individual Shares Breakdown"),
      ).toBeInTheDocument();
    });

    it("renders empty state when no expenses exist", () => {
      render(<ExpenseTable expenses={[]} />);
      expect(screen.getByText("No expenses found")).toBeInTheDocument();
    });
  });

  describe("ExpenseForm Component", () => {
    it("validates equal split and enables submission", async () => {
      api.createExpense.mockResolvedValue({
        id: "exp-new",
        title: "Uber Ride",
      });
      const handleSuccess = vi.fn();

      render(
        <ExpenseForm
          groups={mockGroups}
          selectedGroupId="grp-1"
          onSuccess={handleSuccess}
        />,
      );

      const titleInput = screen.getByLabelText(/Expense Title/i);
      const amountInput = screen.getByLabelText(/Total Amount/i);

      fireEvent.change(titleInput, { target: { value: "Uber Ride" } });
      fireEvent.change(amountInput, { target: { value: "60" } });

      const submitBtn = screen.getByRole("button", { name: /Save Expense/i });
      expect(submitBtn).not.toBeDisabled();

      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.createExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Uber Ride",
            total_amount: 60,
            split_type: "EQUAL",
          }),
        );
        expect(handleSuccess).toHaveBeenCalled();
      });
    });
  });
});
