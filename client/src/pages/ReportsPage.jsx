import React, { useState, useEffect } from "react";
import { getExpenseSummary } from "../services/api";
import { BarChart3, Filter, RotateCcw } from "lucide-react";

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const data = await getExpenseSummary(params);
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expense summary report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleApply = () => {
    fetchSummary();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    getExpenseSummary().then((data) => setSummary(data));
  };

  const totalSpend =
    typeof summary?.total_expense === "number" ? summary.total_expense : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Expense Reports & Visualizations
        </h1>
        <p className="text-sm text-[#707a8c]">
          Visual breakdown of monthly spending by category and aggregated
          expense analytics.
        </p>
      </div>

      {/* Date Filter Toolbar */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#707a8c]">
            <span className="font-medium">Start Date:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-[#707a8c]">
            <span className="font-medium">End Date:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApply}
            className="bg-[#2663eb] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4" /> Apply Filter
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-100 text-[#707a8c] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {error && (
        <div
          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Summary Total Banner */}
      <div className="bg-gradient-to-r from-[#2663eb] to-[#1d4ed8] text-white rounded-xl p-6 shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold opacity-80">
            Filtered Total Spend
          </p>
          <p className="text-3xl font-bold mt-1">${totalSpend.toFixed(2)}</p>
          <p className="text-xs mt-1 opacity-90">
            {summary?.start_date || summary?.end_date
              ? `Range: ${summary.start_date || "Beginning"} to ${summary.end_date || "Present"}`
              : "All-time total expenses"}
          </p>
        </div>
        <BarChart3 className="w-12 h-12 opacity-80" />
      </div>

      {/* Breakdown Details */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#171c29] mb-4">
          Spending Distribution by Category
        </h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading summary report...</p>
        ) : summary?.by_category?.length > 0 ? (
          <div className="space-y-6">
            {summary.by_category.map((item, idx) => {
              const amt =
                typeof item.total_amount === "number"
                  ? item.total_amount
                  : typeof item.total === "number"
                    ? item.total
                    : 0;
              const pct =
                typeof item.percentage === "number" ? item.percentage : 0;
              return (
                <div key={item.category_id || idx} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-[#171c29] text-base">
                      {item.category_name || "Uncategorized"}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-[#2663eb] text-base">
                        ${amt.toFixed(2)}
                      </span>
                      <span className="text-xs text-[#707a8c] ml-2">
                        ({pct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
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
            No expenses recorded for the selected period.
          </p>
        )}
      </div>
    </div>
  );
}
