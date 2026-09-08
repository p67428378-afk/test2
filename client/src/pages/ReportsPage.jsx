import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import StatCard from "../components/StatCard";
import ReportExportPanel from "../components/ReportExportPanel";
import { reportApi } from "../services/api";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#6366F1",
  "#F97316",
];

export default function ReportsPage({ currentUser }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    category_breakdown: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await reportApi.getSummary(startDate, endDate);
      setSummary(
        data || {
          total_income: 0,
          total_expense: 0,
          net_balance: 0,
          category_breakdown: [],
        },
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to generate financial summary report.",
      );
      setSummary({
        total_income: 0,
        total_expense: 0,
        net_balance: 0,
        category_breakdown: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [startDate, endDate, currentUser]);

  const setPreset = (preset) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    if (preset === "this_month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else if (preset === "last_30_days") {
      const past = new Date();
      past.setDate(past.getDate() - 30);
      setStartDate(past.toISOString().split("T")[0]);
      setEndDate(todayStr);
    } else if (preset === "this_year") {
      const firstDayYear = new Date(today.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
      setStartDate(firstDayYear);
      setEndDate(todayStr);
    } else if (preset === "all_time") {
      setStartDate("");
      setEndDate("");
    }
  };

  const formatCurrency = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const totalIncome = Number(summary?.total_income || 0);
  const totalExpense = Number(summary?.total_expense || 0);
  const netBalance =
    summary?.net_balance !== undefined
      ? Number(summary.net_balance)
      : totalIncome - totalExpense;
  const rawBreakdown = Array.isArray(summary?.category_breakdown)
    ? summary.category_breakdown
    : [];

  const chartData = rawBreakdown.map((c) => ({
    name: c.category_name || "Uncategorized",
    amount: Number(c.amount || 0),
    percentage: Number(c.percentage || 0),
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate customized financial summaries and export transaction
            records in CSV & PDF formats
          </p>
        </div>

        {/* Quick Date Presets */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPreset("this_month")}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm"
          >
            This Month
          </button>
          <button
            onClick={() => setPreset("last_30_days")}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setPreset("this_year")}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm"
          >
            This Year
          </button>
          <button
            onClick={() => setPreset("all_time")}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800"
          >
            All Time
          </button>
        </div>
      </div>

      {/* Global Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Date Range & Export Panel */}
      <ReportExportPanel
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Period Income"
          value={`+${formatCurrency(totalIncome)}`}
          icon={TrendingUp}
          variant="income"
          subtitle={
            startDate || endDate ? "Filtered date range" : "All recorded income"
          }
        />
        <StatCard
          title="Period Expenses"
          value={`-${formatCurrency(totalExpense)}`}
          icon={TrendingDown}
          variant="expense"
          subtitle={
            startDate || endDate
              ? "Filtered date range"
              : "All recorded spending"
          }
        />
        <StatCard
          title="Net Savings / Balance"
          value={formatCurrency(netBalance)}
          icon={Wallet}
          variant="balance"
          subtitle={netBalance >= 0 ? "Positive net savings" : "Net deficit"}
        />
      </div>

      {/* Visual Analytics & Data Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Expense Allocation by Category ($)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total spending distribution across categories
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600"></div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-center p-4">
              <p className="text-xs text-slate-400">
                No expense data recorded in this period.
              </p>
            </div>
          ) : (
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    formatter={(val) => formatCurrency(val)}
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderRadius: "8px",
                      color: "#FFF",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Detailed Category Breakdown Table */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Category Spending Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact spending totals and relative percentages
              </p>
            </div>
            <PieChartIcon className="w-4 h-4 text-slate-400" />
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
            </div>
          ) : rawBreakdown.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No category expense breakdown available for this range.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 mt-2">
              {rawBreakdown.map((item, idx) => (
                <div
                  key={item.category_name || idx}
                  className="py-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="font-semibold text-slate-800">
                        {item.category_name || "Uncategorized"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 mr-2">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({item.percentage || 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, item.percentage || 0),
                        )}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
