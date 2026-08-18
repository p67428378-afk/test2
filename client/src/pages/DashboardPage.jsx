import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/common/StatCard";
import ExpenseTable from "../components/expenses/ExpenseTable";
import {
  getExpenseSummary,
  getExpenses,
  getCategories,
  deleteExpense,
} from "../services/api";
import { DollarSign, PieChart, ShoppingBag, Plus, Tag } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [sumData, expData, catData] = await Promise.allSettled([
        getExpenseSummary(),
        getExpenses({ limit: 5 }),
        getCategories(),
      ]);

      const summaryRes = sumData.status === "fulfilled" ? sumData.value : null;
      const expRes = expData.status === "fulfilled" ? expData.value : null;
      const catRes = catData.status === "fulfilled" ? catData.value : [];

      setSummary(summaryRes);

      const expList = Array.isArray(expRes)
        ? expRes
        : expRes?.items && Array.isArray(expRes.items)
          ? expRes.items
          : [];
      setRecentExpenses(expList);

      const catList = Array.isArray(catRes) ? catRes : [];
      setCategories(catList);

      const catMap = {};
      catList.forEach((c) => {
        if (c && c.id) catMap[c.id] = c.name;
      });
      setCategoriesMap(catMap);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchData();
      } catch (err) {
        alert("Failed to delete expense.");
      }
    }
  };

  const topCategory = summary?.by_category?.[0];
  const totalSpend =
    typeof summary?.total_expense === "number" ? summary.total_expense : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171c29]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#707a8c]">
            Track monthly spending, category breakdown, and budget trends.
          </p>
        </div>
        <button
          onClick={() => navigate("/expenses")}
          className="bg-[#2663eb] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#1d4ed8] transition-colors flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {error && (
        <div
          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expense"
          value={`$${totalSpend.toFixed(2)}`}
          subtitle="Total spent across all records"
          icon={DollarSign}
          badgeText="Live"
          badgeColor="bg-blue-100 text-[#2663eb]"
        />
        <StatCard
          title="Top Category"
          value={topCategory?.category_name || "N/A"}
          subtitle={
            topCategory && typeof topCategory.total_amount === "number"
              ? `$${topCategory.total_amount.toFixed(2)} (${(topCategory.percentage || 0).toFixed(1)}%)`
              : "No expenses logged"
          }
          icon={Tag}
          badgeText={
            topCategory && typeof topCategory.percentage === "number"
              ? `${topCategory.percentage.toFixed(0)}%`
              : ""
          }
          badgeColor="bg-green-100 text-green-800"
        />
        <StatCard
          title="Recent Transactions"
          value={recentExpenses.length}
          subtitle="Latest logged records"
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Categories"
          value={categories.length}
          subtitle="Expense categories defined"
          icon={PieChart}
        />
      </div>

      {/* Category Breakdown Progress */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#171c29] mb-4">
          Category Spending Breakdown
        </h2>
        {summary?.by_category?.length > 0 ? (
          <div className="space-y-4">
            {summary.by_category.map((item, idx) => {
              const amt =
                typeof item.total_amount === "number" ? item.total_amount : 0;
              const pct =
                typeof item.percentage === "number" ? item.percentage : 0;
              return (
                <div key={item.category_id || idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-[#171c29]">
                      {item.category_name || "Uncategorized"}
                    </span>
                    <span className="font-medium text-[#707a8c]">
                      ${amt.toFixed(2)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2663eb] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No category breakdown data available yet.
          </p>
        )}
      </div>

      {/* Recent Transactions Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#171c29]">
            Recent Expense Transactions
          </h2>
          <button
            onClick={() => navigate("/expenses")}
            className="text-sm text-[#2663eb] hover:underline font-medium"
          >
            View All →
          </button>
        </div>
        <ExpenseTable
          expenses={recentExpenses}
          categoriesMap={categoriesMap}
          onEdit={(exp) =>
            navigate("/expenses", { state: { editingExpense: exp } })
          }
          onDelete={handleDeleteExpense}
          loading={loading}
        />
      </div>
    </div>
  );
}
