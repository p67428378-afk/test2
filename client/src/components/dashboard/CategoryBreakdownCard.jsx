import React from "react";
import { PieChart } from "lucide-react";

const BAR_COLORS = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-cyan-500",
];

export default function CategoryBreakdownCard({
  categoryBreakdown = [],
  selectedMonth = "",
}) {
  const formattedMonth = React.useMemo(() => {
    if (!selectedMonth || selectedMonth === "all") return "All Months";
    try {
      const [year, month] = selectedMonth.split("-");
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return d.toLocaleString("default", { month: "long", year: "numeric" });
    } catch {
      return selectedMonth;
    }
  }, [selectedMonth]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-400" />
          Category Spending Breakdown ({formattedMonth})
        </h2>
      </div>

      {!categoryBreakdown || categoryBreakdown.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No expense breakdown available for this timeframe.
        </div>
      ) : (
        <div className="space-y-4">
          {categoryBreakdown.map((item, idx) => {
            const colorClass = BAR_COLORS[idx % BAR_COLORS.length];
            const pct = Math.min(100, Math.max(0, item.percentage || 0));
            return (
              <div key={item.category || idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.category}</span>
                  <span className="text-slate-200">
                    ${Number(item.amount || 0).toFixed(2)} ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${colorClass} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
