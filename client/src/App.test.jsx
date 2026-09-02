import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Receipt: () => <div data-testid="icon-receipt" />,
  LayoutDashboard: () => <div data-testid="icon-dashboard" />,
  PlusCircle: () => <div data-testid="icon-plus" />,
  ArrowLeftRight: () => <div data-testid="icon-arrows" />,
  Users: () => <div data-testid="icon-users" />,
  UserPlus: () => <div data-testid="icon-user-plus" />,
  DollarSign: () => <div data-testid="icon-dollar" />,
  User: () => <div data-testid="icon-user" />,
  ArrowUpRight: () => <div data-testid="icon-arrow-up" />,
  ArrowDownLeft: () => <div data-testid="icon-arrow-down" />,
  CheckCircle2: () => <div data-testid="icon-check-circle" />,
  ArrowRight: () => <div data-testid="icon-arrow-right" />,
  Tag: () => <div data-testid="icon-tag font-tag" />,
  Calendar: () => <div data-testid="icon-calendar" />,
  Info: () => <div data-testid="icon-info" />,
  X: () => <div data-testid="icon-x" />,
  Scale: () => <div data-testid="icon-scale" />,
  Percent: () => <div data-testid="icon-percent" />,
  AlertCircle: () => <div data-testid="icon-alert" />,
  FileText: () => <div data-testid="icon-filetext" />,
  Check: () => <div data-testid="icon-check" />,
  RefreshCw: () => <div data-testid="icon-refresh" />,
}));

// Import components
import GroupHeaderBanner from "./components/expenses/GroupHeaderBanner";
import NetBalanceMetricGroup from "./components/expenses/NetBalanceMetricGroup";
import DebtMatrixCard from "./components/expenses/DebtMatrixCard";
import ExpenseTable from "./components/expenses/ExpenseTable";
import SettlementLedgerTable from "./components/settlements/SettlementLedgerTable";
import { BrowserRouter } from "react-router-dom";

describe("Shared Bill Splitter UI Components", () => {
  const mockGroup = {
    id: "g1",
    name: "Summer Vacation 2026",
    description: "Group trip",
    members: [
      { id: "m1", name: "User A", email: "usera@example.com" },
      { id: "m2", name: "User B", email: "userb@example.com" },
      { id: "m3", name: "User C", email: "userc@example.com" },
    ],
  };

  it("renders GroupHeaderBanner with title and member count", () => {
    render(
      <BrowserRouter>
        <GroupHeaderBanner group={mockGroup} totalExpenses={120} />
      </BrowserRouter>,
    );
    expect(screen.getByText("Summer Vacation 2026")).toBeInTheDocument();
    expect(screen.getByText("3 Members")).toBeInTheDocument();
  });

  it("renders NetBalanceMetricGroup correctly", () => {
    const balances = [
      { member_id: "m1", member_name: "User A", net_balance: 80 },
      { member_id: "m2", member_name: "User B", net_balance: -40 },
      { member_id: "m3", member_name: "User C", net_balance: -40 },
    ];
    render(<NetBalanceMetricGroup netBalances={balances} />);
    expect(screen.getByText("User A")).toBeInTheDocument();
    expect(screen.getByText("User B")).toBeInTheDocument();
    expect(screen.getByText("User C")).toBeInTheDocument();
  });

  it("renders DebtMatrixCard with debts", () => {
    const debts = [
      {
        from_member_id: "m2",
        from_member_name: "User B",
        to_member_id: "m1",
        to_member_name: "User A",
        amount: 40,
      },
    ];
    render(
      <BrowserRouter>
        <DebtMatrixCard simplifiedSettlements={debts} groupId="g1" />
      </BrowserRouter>,
    );
    expect(screen.getAllByText("User B")[0]).toBeInTheDocument();
    expect(screen.getAllByText("User A")[0]).toBeInTheDocument();
    expect(screen.getByText("40.00")).toBeInTheDocument();
  });

  it("renders ExpenseTable with expenses", () => {
    const expenses = [
      {
        id: "e1",
        title: "Group Dinner",
        total_amount: 120,
        payer_id: "m1",
        split_type: "EQUAL",
        date: "2026-09-02",
        category: "Dining",
        description: "Dinner at Olive Garden",
      },
    ];
    render(<ExpenseTable expenses={expenses} members={mockGroup.members} />);
    expect(screen.getByText("Group Dinner")).toBeInTheDocument();
    expect(screen.getByText("$120.00")).toBeInTheDocument();
  });

  it("renders SettlementLedgerTable with settlement history", () => {
    const settlements = [
      {
        id: "s1",
        payer_id: "m2",
        payee_id: "m1",
        amount: 40,
        date: "2026-09-02",
        notes: "Venmo transfer",
      },
    ];
    render(
      <SettlementLedgerTable
        settlements={settlements}
        members={mockGroup.members}
      />,
    );
    expect(screen.getByText("User B")).toBeInTheDocument();
    expect(screen.getByText("User A")).toBeInTheDocument();
    expect(screen.getByText("$40.00")).toBeInTheDocument();
  });
});
