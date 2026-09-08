import React from "react";

export default function BudgetSummaryCard({
  budget = 0,
  currency = "USD",
  items = [],
  onSave,
}) {
  const dailyBudgetNum = Number(budget) || 0;

  const totalEstimatedSpend = items.reduce(
    (sum, item) => sum + (Number(item.estimated_cost) || 0),
    0,
  );

  const remainingBudget = dailyBudgetNum - totalEstimatedSpend;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Budget Breakdown</h3>

      <div className="space-y-3 border-b border-slate-200 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Daily Budget Limit</span>
          <span className="font-semibold text-slate-900">
            ${dailyBudgetNum.toFixed(2)} {currency}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Total Est. Spend</span>
          <span className="font-semibold text-blue-600">
            ${totalEstimatedSpend.toFixed(2)} {currency}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Remaining Budget</span>
          <span
            className={`font-semibold ${
              remainingBudget >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${remainingBudget.toFixed(2)} {currency}
          </span>
        </div>
      </div>

      {onSave && (
        <button
          onClick={onSave}
          className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm"
        >
          Save Recommendation
        </button>
      )}
    </div>
  );
}
