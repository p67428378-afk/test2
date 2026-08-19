import React, { useState, useEffect } from "react";
import { DollarSign, Filter, RefreshCw, Calendar } from "lucide-react";
import StatCard from "../components/common/StatCard";
import CategoryChart from "../components/costs/CategoryChart";
import BudgetBreakdownTable from "../components/costs/BudgetBreakdownTable";
import Button from "../components/common/Button";
import { costsAPI, categoriesAPI } from "../services/api";

export default function CostsPage() {
  const [summaryData, setSummaryData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchCostData = async () => {
    setLoading(true);
    setError("");
    try {
      const [cats, summary] = await Promise.all([
        categoriesAPI.listCategories().catch(() => []),
        costsAPI
          .getSummary({
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            category_id: selectedCategory || undefined,
          })
          .catch(() => null),
      ]);

      setCategories(cats || []);
      setSummaryData(summary);
    } catch (err) {
      setError("Failed to fetch cost analytics summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostData();
  }, [startDate, endDate, selectedCategory]);

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
  };

  const totalEst = summaryData?.total_estimated || 0;
  const totalAct = summaryData?.total_actual || 0;
  const totalVar = summaryData?.variance || 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Cost Analytics & Budget Tracking
        </h1>
        <p className="text-xs text-[#707a8c] mt-0.5">
          Analyze cumulative estimated vs actual expenses across categories and
          date ranges.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Estimated Total Cost"
          value={`$${totalEst.toFixed(2)}`}
          subtext="Budgeted expenses"
          icon={DollarSign}
        />
        <StatCard
          label="Actual Total Spent"
          value={`$${totalAct.toFixed(2)}`}
          subtext="Recorded actual costs"
          icon={DollarSign}
        />
        <StatCard
          label="Cost Variance"
          value={`${totalVar >= 0 ? "+" : ""}$${totalVar.toFixed(2)}`}
          subtext="Actual minus Estimated"
          badgeText={totalVar > 0 ? "Over Budget" : "Under Budget"}
          badgeVariant={totalVar > 0 ? "danger" : "success"}
          icon={DollarSign}
        />
      </div>

      {/* Date Range & Category Filter Controls */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Start Date */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#707a8c]">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#707a8c]">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#707a8c]">
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(startDate || endDate || selectedCategory) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetFilters}
            icon={RefreshCw}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center text-sm text-[#707a8c]">
          Calculating financial summary...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chart */}
          <CategoryChart
            categoryBreakdown={summaryData?.category_breakdown || []}
          />

          {/* Breakdown Table */}
          <BudgetBreakdownTable summaryData={summaryData} />
        </div>
      )}
    </div>
  );
}
