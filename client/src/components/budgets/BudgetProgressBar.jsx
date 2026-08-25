import React from "react";
import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

export default function BudgetProgressBar({ budget, onDelete }) {
  const {
    id,
    category_name = "General",
    category_color = "#2663eb",
    monthly_limit = 0,
    total_spent = 0,
    remaining_balance = 0,
    utilization_percentage = 0,
  } = budget;

  const pct = Number(utilization_percentage) || 0;
  const isOverBudget = pct > 100;
  const isWarning = pct >= 80 && pct <= 100;

  // Determine bar fill color
  let barColor = "#2663eb";
  let badgeColor = "text-[#2663eb]";
  if (isOverBudget) {
    barColor = "#db2626";
    badgeColor = "text-[#db2626]";
  } else if (isWarning) {
    barColor = "#eb9917";
    badgeColor = "text-[#eb9917]";
  }

  const formatCurrency = (val) => `$${Number(val || 0).toFixed(2)}`;

  return (
    <div className="flex flex-col gap-2 p-3 bg-[#f7fafc]/80 rounded-xl border border-[#e3e8f0] transition-all hover:bg-white hover:shadow-sm">
      {/* Header Info */}
      <div className="flex items-center justify-between text-sm flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: category_color }}
          ></span>
          <span className="font-semibold text-[#171c29]">{category_name}</span>
          {isOverBudget && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#db2626] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" /> Over Budget (+
              {(pct - 100).toFixed(1)}%)
            </span>
          )}
          {!isOverBudget && !isWarning && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#17a34a] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" /> On Track
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold ${badgeColor}`}>
            {formatCurrency(total_spent)} / {formatCurrency(monthly_limit)} (
            {pct.toFixed(0)}%)
          </span>
          {onDelete && id && (
            <button
              type="button"
              onClick={() => onDelete(id)}
              title="Delete Category Budget"
              className="text-[#707a8c] hover:text-[#db2626] p-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[#e3e8f0] h-2.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(pct, 100)}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-[#707a8c]">
        <span>
          {isOverBudget
            ? `Over limit by ${formatCurrency(Math.abs(remaining_balance))}`
            : `${formatCurrency(remaining_balance)} remaining`}
        </span>
        <span>Limit: {formatCurrency(monthly_limit)}</span>
      </div>
    </div>
  );
}
