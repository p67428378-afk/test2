import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  PlusCircle,
  ArrowRight,
  DollarSign,
  Wallet,
  ShieldCheck,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";
import Button from "../components/common/Button";
import {
  getAnalyticsSummary,
  getCategories,
  getExpenses,
  createExpense,
  deleteExpense,
  formatApiError,
} from "../services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const periodLabel = `${monthNames[currentMonth - 1]} ${currentYear}`;

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 4000);
  };

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sumData, catData, expData] = await Promise.all([
        getAnalyticsSummary({ month: currentMonth, year: currentYear }),
        getCategories(),
        getExpenses({ limit: 5, sort_by: "date_desc" }),
      ]);
      setSummary(sumData);
      setCategories(catData);
      setRecentExpenses(expData);
    } catch (err) {
      showNotification("error", formatApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateExpense = async (payload, onSuccess) => {
    setIsFormSubmitting(true);
    try {
      await createExpense(payload);
      showNotification(
        "success",
        `Logged expense "${payload.title}" ($${payload.amount.toFixed(2)}) successfully!`,
      );
      if (onSuccess) onSuccess();
      loadDashboardData();
    } catch (err) {
      showNotification("error", formatApiError(err));
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id, onDone) => {
    try {
      await deleteExpense(id);
      showNotification("success", "Expense record deleted successfully.");
      loadDashboardData();
    } catch (err) {
      showNotification("error", formatApiError(err));
    } finally {
      if (onDone) onDone();
    }
  };

  const handleExportCsv = () => {
    if (recentExpenses.length === 0) {
      showNotification("error", "No expense records available to export.");
      return;
    }
    const headers = [
      "ID",
      "Date",
      "Title",
      "Category",
      "Payment Method",
      "Amount",
      "Description",
    ];
    const rows = recentExpenses.map((e) => [
      e.id,
      e.expense_date,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${(e.category_name || "").replace(/"/g, '""')}"`,
      `"${(e.payment_method || "").replace(/"/g, '""')}"`,
      e.amount,
      `"${(e.description || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `expenses_${currentYear}_${currentMonth}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("success", "CSV export initiated successfully.");
  };

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const budgetUtilization =
    summary && summary.monthly_budget_limit > 0
      ? Math.round((summary.total_spent / summary.monthly_budget_limit) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Toast Notification */}
      {notification.message && (
        <div
          role="alert"
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm transition-all ${
            notification.type === "error"
              ? "bg-rose-50 border-rose-200 text-[#db2626]"
              : "bg-emerald-50 border-emerald-200 text-[#17a34a]"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171c29] tracking-tight">
            Monthly Overview — {periodLabel}
          </h1>
          <p className="text-sm text-[#707a8c] mt-1">
            Track your spending, budget limits, and financial health in
            real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
          <Link to="/expenses">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Manage Expenses
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Spent This Month"
          value={isLoading ? "..." : formatCurrency(summary?.total_spent)}
          badgeText={summary ? `${summary.transaction_count} Expenses` : ""}
          badgeVariant="primary"
          icon={DollarSign}
        />
        <StatCard
          title="Monthly Budget Limit"
          value={
            isLoading ? "..." : formatCurrency(summary?.monthly_budget_limit)
          }
          badgeText={summary ? `${budgetUtilization}% utilized` : ""}
          badgeVariant={
            budgetUtilization > 100
              ? "danger"
              : budgetUtilization > 80
                ? "warning"
                : "success"
          }
          icon={Wallet}
        />
        <StatCard
          title="Remaining Balance"
          value={isLoading ? "..." : formatCurrency(summary?.remaining_balance)}
          badgeText={
            summary && summary.remaining_balance >= 0
              ? "On Track"
              : "Over Limit"
          }
          badgeVariant={
            summary && summary.remaining_balance >= 0 ? "success" : "danger"
          }
          icon={ShieldCheck}
        />
        <StatCard
          title="Daily Average Spend"
          value={isLoading ? "..." : formatCurrency(summary?.daily_average)}
          badgeText={
            summary?.categories_over_limit_count > 0
              ? `${summary.categories_over_limit_count} Alert`
              : "Healthy"
          }
          badgeVariant={
            summary?.categories_over_limit_count > 0 ? "warning" : "success"
          }
          icon={Activity}
        />
      </div>

      {/* Split Layout: Quick Expense Form (Left) & Recent Transactions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Log New Expense Form */}
        <div className="lg:col-span-5 w-full">
          <ExpenseForm
            categories={categories}
            onSubmit={handleCreateExpense}
            isLoading={isFormSubmitting}
          />
        </div>

        {/* Right Column: Recent Transactions Table */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full">
          <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f0]">
              <div>
                <h2 className="text-lg font-bold text-[#171c29]">
                  Recent Transactions
                </h2>
                <p className="text-xs text-[#707a8c]">
                  Showing latest transactions logged this billing period
                </p>
              </div>

              <Link
                to="/expenses"
                className="text-xs font-semibold text-[#2663eb] hover:text-[#1d4ed8] flex items-center gap-1"
              >
                <span>View All Expenses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4">
              <ExpenseTable
                expenses={recentExpenses}
                isLoading={isLoading}
                onEdit={() => {}}
                onDelete={handleDeleteExpense}
                showPagination={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
