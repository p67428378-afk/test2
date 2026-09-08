import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Tag,
  Hash,
  RefreshCw,
  Plus,
  AlertTriangle,
} from "lucide-react";
import MetricCard from "../components/dashboard/MetricCard";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import ExpenseTable from "../components/expenses/ExpenseTable";
import {
  getDashboardSummary,
  getExpenses,
  deleteExpense,
} from "../services/api";

export default function DashboardPage({ onOpenAddModal, onEditExpense }) {
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryData, expensesData] = await Promise.all([
        getDashboardSummary(),
        getExpenses({ limit: 5, sort_by: "date", sort_order: "desc" }),
      ]);
      setSummary(summaryData);
      setRecentExpenses(expensesData || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(
        "Unable to load dashboard metrics. Please verify the backend API service.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchData();
    } catch (err) {
      console.error("Delete expense failed:", err);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(summary?.total_expenses || 0);

  const formattedMonthlyAvg = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(summary?.monthly_average || 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time spending analytics and summary metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            title="Refresh Metrics"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-bold px-3 py-1 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Cumulative Expenses"
          value={isLoading ? "..." : formattedTotal}
          subtitle="All time total spending"
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Monthly Average"
          value={isLoading ? "..." : formattedMonthlyAvg}
          subtitle="Estimated monthly spend"
          icon={Calendar}
          color="emerald"
        />
        <MetricCard
          title="Top Category"
          value={isLoading ? "..." : summary?.top_category || "N/A"}
          subtitle="Highest spending category"
          icon={Tag}
          color="amber"
        />
        <MetricCard
          title="Expense Count"
          value={
            isLoading
              ? "..."
              : String(summary?.expense_count ?? summary?.total_count ?? 0)
          }
          subtitle="Total recorded expenses"
          icon={Hash}
          color="indigo"
        />
      </div>

      {/* Main Grid: Category Breakdown + Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (1 col) */}
        <div className="lg:col-span-1">
          <CategoryBreakdown
            breakdown={
              summary?.by_category || summary?.category_breakdown || []
            }
            totalExpenses={summary?.total_expenses || 0}
          />
        </div>

        {/* Recent Expenses Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Expenses
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Latest 5
            </span>
          </div>
          <ExpenseTable
            expenses={recentExpenses}
            onEdit={onEditExpense}
            onDelete={handleDelete}
            isLoading={isLoading}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
}
