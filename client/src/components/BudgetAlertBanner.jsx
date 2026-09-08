import React from "react";
import { AlertTriangle, AlertOctagon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BudgetAlertBanner({ budgets = [] }) {
  const alerts = budgets.filter(
    (b) => b.alert_level === "WARNING" || b.alert_level === "BREACHED",
  );

  if (!alerts.length) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      {alerts.map((budget) => {
        const isBreached = budget.alert_level === "BREACHED";
        const formattedSpent = Number(budget.spent).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
        const formattedLimit = Number(budget.monthly_limit).toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          },
        );

        return (
          <div
            key={budget.id || budget.category_id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border shadow-sm gap-3 ${
              isBreached
                ? "bg-rose-50 border-rose-200 text-rose-900 border-l-4 border-l-rose-600"
                : "bg-amber-50 border-amber-200 text-amber-900 border-l-4 border-l-amber-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isBreached
                    ? "bg-rose-100 text-rose-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {isBreached ? (
                  <AlertOctagon className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-xs mr-2 px-2 py-0.5 rounded-full inline-block bg-white/60">
                  {isBreached ? "🚨 BREACHED" : "⚠️ WARNING"}
                </span>
                <span className="font-medium text-sm">
                  <strong>'{budget.category_name}'</strong> category budget is
                  at <span className="font-bold">{budget.percentage}%</span> (
                  {formattedSpent} / {formattedLimit})
                </span>
              </div>
            </div>

            <Link
              to="/budgets"
              className={`inline-flex items-center gap-1 text-xs font-bold hover:underline self-end sm:self-auto ${
                isBreached ? "text-rose-700" : "text-amber-800"
              }`}
            >
              Adjust Budget <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
