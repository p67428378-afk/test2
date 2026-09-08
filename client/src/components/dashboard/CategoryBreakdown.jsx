import React from "react";
import { PieChart, Tag } from "lucide-react";

const CATEGORY_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-rose-600",
  "bg-cyan-600",
];

export default function CategoryBreakdown({
  breakdown = [],
  totalExpenses = 0,
}) {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-center items-center text-center py-12">
        <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3">
          <PieChart className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-700">
          No Category Data
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Add expenses to see your category breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Expenses by Category
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
          {breakdown.length} Categories
        </span>
      </div>

      <div className="space-y-4">
        {breakdown.map((item, index) => {
          const colorClass = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          const formattedAmount = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(item.total_amount || 0);

          const percentage = item.percentage
            ? item.percentage.toFixed(1)
            : "0.0";

          return (
            <div key={item.category || index} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${colorClass}`}
                  ></span>
                  <span className="font-medium text-slate-700">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({item.count} items)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">
                    {formattedAmount}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                  style={{
                    width: `${Math.min(Math.max(item.percentage || 0, 2), 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
