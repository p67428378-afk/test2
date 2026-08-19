import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";

export default function CostAnalyticsCard({ summary }) {
  const {
    total_estimated_cost = 0,
    total_actual_cost = 0,
    cost_variance = 0,
    completed_tasks_count = 0,
    pending_tasks_count = 0,
  } = summary || {};

  const isUnderBudget = cost_variance <= 0;

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#e3e8f0] pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-[#1f40b0] rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#171c29]">
              Maintenance Cost Overview
            </h2>
            <p className="text-xs text-[#707a8c]">
              Aggregated budget & expenditure metrics
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            isUnderBudget
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isUnderBudget ? (
            <TrendingDown className="w-3.5 h-3.5" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          {isUnderBudget ? "Under Budget" : "Over Budget"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#f7fafc] p-4 rounded-lg border border-[#e3e8f0]">
          <p className="text-xs text-[#707a8c] font-medium">
            Total Estimated Budget
          </p>
          <p className="text-2xl font-bold text-[#171c29] mt-1">
            ${total_estimated_cost.toFixed(2)}
          </p>
        </div>

        <div className="bg-[#f7fafc] p-4 rounded-lg border border-[#e3e8f0]">
          <p className="text-xs text-[#707a8c] font-medium">
            Total Actual Expense
          </p>
          <p className="text-2xl font-bold text-[#171c29] mt-1">
            ${total_actual_cost.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${isUnderBudget ? "bg-emerald-50/50 border-emerald-200" : "bg-red-50/50 border-red-200"}`}
        >
          <p className="text-xs text-[#707a8c] font-medium">Cost Variance</p>
          <p
            className={`text-2xl font-bold mt-1 ${isUnderBudget ? "text-emerald-700" : "text-red-700"}`}
          >
            {cost_variance > 0
              ? `+$${cost_variance.toFixed(2)}`
              : `-$${Math.abs(cost_variance).toFixed(2)}`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-around bg-gray-50 p-4 rounded-lg border border-[#e3e8f0] text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <div>
            <span className="font-bold text-[#171c29]">
              {completed_tasks_count}
            </span>
            <span className="text-[#707a8c] text-xs block">
              Completed Tasks
            </span>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <div>
            <span className="font-bold text-[#171c29]">
              {pending_tasks_count}
            </span>
            <span className="text-[#707a8c] text-xs block">
              Pending / In Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
