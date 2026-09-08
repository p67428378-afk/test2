import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowRight,
  Plus,
  Receipt,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import StatCard from "../components/StatCard";
import BudgetAlertBanner from "../components/BudgetAlertBanner";
import LogTransactionModal from "../components/LogTransactionModal";
import { reportApi, budgetApi, expenseApi, categoryApi } from "../services/api";

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#6366F1", // Indigo
  "#F97316", // Orange
];

export default function DashboardPage({ currentUser }) {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    category_breakdown: [],
  });
  const [budgets, setBudgets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryRes, budgetRes, txRes, catRes] = await Promise.all([
        reportApi.getSummary(),
        budgetApi.getBudgets(),
        expenseApi.getExpenses({ limit: 5 }),
        categoryApi.getCategories(),
      ]);
      setSummary(summaryRes);
      setBudgets(budgetRes);
      setRecentTransactions(txRes.items || []);
      setCategories(catRes || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load dashboard financial data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleCreateTransaction = async (payload) => {
    setModalLoading(true);
    setModalError("");
    try {
      await expenseApi.createExpense(payload);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setModalError(
        err.response?.data?.detail || "Failed to create transaction.",
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Format currencies
  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  // Calculate Savings Rate
  const savingsRate =
    summary.total_income > 0
      ? (
          ((summary.total_income - summary.total_expense) /
            summary.total_income) *
          100
        ).toFixed(1)
      : "0.0";

  // Prepare chart data
  const chartData = summary.category_breakdown.map((item) => ({
    name: item.category_name,
    value: item.amount,
    percentage: item.percentage,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time overview of income, expenses, category allocations &
            budgets
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Transaction</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Budget Threshold Alert Banners (80% warning / 100% breached) */}
      <BudgetAlertBanner budgets={budgets} />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Income"
          value={`+${formatCurrency(summary.total_income)}`}
          icon={TrendingUp}
          variant="income"
          subtitle="All recorded earnings"
        />
        <StatCard
          title="Total Expenses"
          value={`-${formatCurrency(summary.total_expense)}`}
          icon={TrendingDown}
          variant="expense"
          subtitle="All recorded spending"
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(summary.net_balance)}
          icon={Wallet}
          variant="balance"
          subtitle={
            summary.net_balance >= 0 ? "Surplus balance" : "Deficit balance"
          }
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          icon={PiggyBank}
          variant="savings"
          subtitle="Net savings / Total income"
        />
      </div>

      {/* Analytics & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Spending Donut Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">
                Spending by Category
              </h2>
              <PieChartIcon className="w-4 h-4 text-slate-400" />
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600"></div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                <p className="text-xs text-slate-400">
                  No expense breakdown available yet. Log expenses to view
                  category allocations.
                </p>
              </div>
            ) : (
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => formatCurrency(val)}
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderRadius: "8px",
                        color: "#FFF",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>View Full Analytics Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-base text-slate-900">
                  Recent Transactions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest 5 recorded income and expense logs
                </p>
              </div>
              <Link
                to="/transactions"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No transactions recorded yet. Click '+ Log Transaction' to start
                tracking.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {recentTransactions.map((tx) => {
                  const isIncome = tx.transaction_type === "Income";
                  return (
                    <div
                      key={tx.id}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-lg px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg text-xs font-bold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {isIncome ? "INC" : "EXP"}
                        </div>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm text-slate-900">
                            {tx.description ||
                              tx.category?.name ||
                              "General Transaction"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {tx.date} • {tx.payment_method} •{" "}
                            {tx.category?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`text-xs sm:text-sm font-bold ${
                          isIncome ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isIncome
                          ? `+${formatCurrency(tx.amount)}`
                          : `-${formatCurrency(tx.amount)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top recent transactions</span>
            <Link
              to="/transactions"
              className="font-semibold text-blue-600 hover:underline"
            >
              Manage & Filter All Transactions &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Log Transaction Modal */}
      <LogTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransaction}
        categories={categories}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
}
