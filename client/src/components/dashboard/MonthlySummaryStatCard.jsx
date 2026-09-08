import React from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function MonthlySummaryStatCard({
  monthlyTotal = 0,
  selectedMonth = "",
  totalExpenses = null,
  comparisonPercentage = null,
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

  const displayTotal = typeof monthlyTotal === "number" ? monthlyTotal : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedMonth} Total Spending
          </span>
          <span className="text-3xl font-extrabold text-white mt-1.5 block">
            ${displayTotal.toFixed(2)}
          </span>
        </div>
        <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
          <DollarSign className="w-7 h-7" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        {totalExpenses !== null && (
          <span>
            Cumulative Total:{" "}
            <strong className="text-slate-200">
              ${Number(totalExpenses).toFixed(2)}
            </strong>
          </span>
        )}
        {comparisonPercentage !== null &&
          comparisonPercentage !== undefined && (
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {comparisonPercentage}
            </span>
          )}
      </div>
    </div>
  );
}
