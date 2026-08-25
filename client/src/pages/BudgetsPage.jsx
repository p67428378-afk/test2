import React, { useState, useEffect, useCallback } from "react";
import {
  Target,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import BudgetProgressBar from "../components/budgets/BudgetProgressBar";
import BudgetForm from "../components/budgets/BudgetForm";
import AnalyticsTrendCard from "../components/analytics/AnalyticsTrendCard";
import Button from "../components/common/Button";
import {
  getBudgets,
  getCategories,
  createOrUpdateBudget,
  deleteBudget,
  getAnalyticsSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  formatApiError,
} from "../services/api";

export default function BudgetsPage() {
  const currentInitialMonth = new Date().getMonth() + 1;
  const currentInitialYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentInitialMonth);
  const [selectedYear, setSelectedYear] = useState(currentInitialYear);

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 4000);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bData, cData, sData, brkData, trendData] = await Promise.all([
        getBudgets({ month: selectedMonth, year: selectedYear }),
        getCategories(),
        getAnalyticsSummary({ month: selectedMonth, year: selectedYear }),
        getCategoryBreakdown({ month: selectedMonth, year: selectedYear }),
        getMonthlyTrend(6),
      ]);
      setBudgets(bData);
      setCategories(cData);
      setSummary(sData);
      setBreakdown(brkData);
      setMonthlyTrend(trendData);
    } catch (err) {
      showNotification("error", formatApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveBudget = async (payload, onDone) => {
    setIsSubmitting(true);
    try {
      const res = await createOrUpdateBudget(payload);
      showNotification(
        "success",
        `Budget for category updated to $${Number(res.monthly_limit).toFixed(2)}.`,
      );
      if (onDone) onDone();
      loadData();
    } catch (err) {
      showNotification("error", formatApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm("Remove this category budget limit?")) {
      try {
        await deleteBudget(id);
        showNotification("success", "Budget limit removed.");
        loadData();
      } catch (err) {
        showNotification("error", formatApiError(err));
      }
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

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

  const totalLimit = summary?.monthly_budget_limit || 0;
  const totalSpent = summary?.total_spent || 0;
  const utilizationPct =
    totalLimit > 0 ? ((totalSpent / totalLimit) * 100).toFixed(1) : "0.0";

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

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171c29] tracking-tight">
            Category Budgets & Spending Analytics
          </h1>
          <p className="text-sm text-[#707a8c] mt-1">
            Monitor monthly threshold consumption, budget overruns, and
            historical spending curves.
          </p>
        </div>

        {/* Month / Year Filter Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-[#e3e8f0] p-1.5 rounded-lg shadow-sm">
            <label
              htmlFor="period-month"
              className="text-xs font-medium text-[#707a8c] pl-2"
            >
              Period:
            </label>
            <select
              id="period-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-sm font-semibold text-[#171c29] focus:outline-none cursor-pointer"
            >
              {monthNames.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              id="period-year"
              aria-label="Select Period Year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-sm font-semibold text-[#171c29] focus:outline-none cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Budget Utilization"
          value={isLoading ? "..." : `${utilizationPct}%`}
          badgeText={
            Number(utilizationPct) > 100
              ? "Over Budget"
              : Number(utilizationPct) > 85
                ? "Warning (>85%)"
                : "Healthy (<85%)"
          }
          badgeVariant={
            Number(utilizationPct) > 100
              ? "danger"
              : Number(utilizationPct) > 85
                ? "warning"
                : "success"
          }
          icon={PieChart}
        />
        <StatCard
          title="Total Budget Limit"
          value={isLoading ? "..." : formatCurrency(totalLimit)}
          badgeText={`${budgets.length} Active Categories`}
          badgeVariant="primary"
          icon={Target}
        />
        <StatCard
          title="Total Actual Spent"
          value={isLoading ? "..." : formatCurrency(totalSpent)}
          badgeText={`${formatCurrency(summary?.remaining_balance)} Remaining`}
          badgeVariant={summary?.remaining_balance >= 0 ? "success" : "danger"}
          icon={TrendingUp}
        />
        <StatCard
          title="Categories Over Limit"
          value={
            isLoading
              ? "..."
              : `${summary?.categories_over_limit_count || 0} Alert`
          }
          badgeText={
            summary?.over_limit_categories?.length > 0
              ? `${summary.over_limit_categories[0]}`
              : "All within budget"
          }
          badgeVariant={
            summary?.categories_over_limit_count > 0 ? "danger" : "success"
          }
          icon={AlertTriangle}
        />
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Category Budget Breakdown */}
        <div className="lg:col-span-6 flex flex-col gap-4 w-full">
          <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8f0]">
              <div>
                <h2 className="text-lg font-bold text-[#171c29]">
                  Category Budget Breakdown
                </h2>
                <p className="text-xs text-[#707a8c]">
                  {monthNames[selectedMonth - 1]} {selectedYear} active
                  thresholds
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#f2f5fa] text-[#707a8c] rounded-md">
                {budgets.length} Configured
              </span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-[#707a8c]">
                Loading budget data...
              </div>
            ) : budgets.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#707a8c] bg-[#f7fafc] rounded-lg border border-[#e3e8f0]">
                No budgets set for {monthNames[selectedMonth - 1]}{" "}
                {selectedYear}. Use the form on the right to set category
                spending limits!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {budgets.map((b) => (
                  <BudgetProgressBar
                    key={b.id || b.category_id}
                    budget={b}
                    onDelete={handleDeleteBudget}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Set/Update Budget Form & Monthly Trend */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          {/* Budget Setting Form */}
          <BudgetForm
            categories={categories}
            budgets={budgets}
            currentMonth={selectedMonth}
            currentYear={selectedYear}
            onSubmit={handleSaveBudget}
            isLoading={isSubmitting}
          />

          {/* Historical Trend & Category Distribution */}
          <AnalyticsTrendCard
            monthlyTrend={monthlyTrend}
            categoryBreakdown={breakdown}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
