import React from "react";
import {
  Plus,
  Trash2,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  PieChart,
} from "lucide-react";

export default function BudgetTable({
  budgets = [],
  month,
  onMonthChange,
  onOpenSetBudget,
  onDelete,
  loading = false,
}) {
  const getAlertBadge = (alertLevel, percentage) => {
    switch (alertLevel) {
      case "BREACHED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            Breached ({percentage}%)
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Warning ({percentage}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            On Track ({percentage}%)
          </span>
        );
    }
  };

  const getProgressBarColor = (alertLevel) => {
    if (alertLevel === "BREACHED") return "bg-rose-600";
    if (alertLevel === "WARNING") return "bg-amber-500";
    return "bg-blue-600";
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-lg text-slate-900">
            Monthly Category Budgets
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Track category spending thresholds with 80% warning and 100% breach
            alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={onOpenSetBudget}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-sm shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Set Budget</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-3"></div>
          <p className="text-sm text-slate-500">
            Loading budget allocations...
          </p>
        </div>
      ) : !budgets.length ? (
        <div className="py-12 text-center">
          <div className="p-3 bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <PieChart className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-800">
            No category budgets for this month
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click 'Set Budget' above to allocate spending limits for your
            expense categories.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 mt-4">
          {budgets.map((b) => {
            const formattedLimit = Number(b.monthly_limit).toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              },
            );
            const formattedSpent = Number(b.spent).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });
            const remaining = Math.max(0, b.monthly_limit - b.spent);
            const formattedRemaining = remaining.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });

            return (
              <div key={b.id || b.category_id} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900">
                      {b.category_name}
                    </span>
                    {getAlertBadge(b.alert_level, b.percentage)}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-500">
                      Spent:{" "}
                      <strong className="text-slate-900">
                        {formattedSpent}
                      </strong>{" "}
                      / {formattedLimit}
                    </span>
                    <span className="text-slate-500 hidden sm:inline">
                      Left:{" "}
                      <strong className="text-emerald-600">
                        {formattedRemaining}
                      </strong>
                    </span>
                    {onDelete && b.id && (
                      <button
                        onClick={() => onDelete(b.id)}
                        title="Delete Budget"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(
                      b.alert_level,
                    )}`}
                    style={{ width: `${Math.min(100, b.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
