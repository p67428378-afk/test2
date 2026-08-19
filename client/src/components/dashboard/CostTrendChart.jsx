import React from "react";

export default function CostTrendChart({ monthlyTrends = [] }) {
  if (!monthlyTrends || monthlyTrends.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[260px] text-center">
        <p className="text-sm font-medium text-[#707a8c]">
          No monthly trend data available
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Record maintenance events to visualize monthly expenditure trends.
        </p>
      </div>
    );
  }

  const maxCost = Math.max(...monthlyTrends.map((t) => t.total_cost), 1);

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#171c29]">
            Monthly Cost Trends
          </h3>
          <p className="text-xs text-[#707a8c]">
            Maintenance expenditure tracked over time
          </p>
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-[#e3e8f0] pb-2">
        {monthlyTrends.map((item, idx) => {
          const heightPercent = Math.max(
            Math.round((item.total_cost / maxCost) * 100),
            6,
          );
          return (
            <div
              key={item.month || idx}
              className="flex-1 flex flex-col items-center gap-2 group relative"
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#171c29] text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-10">
                ${item.total_cost.toFixed(2)} ({item.event_count} events)
              </div>
              <div className="w-full bg-blue-50 rounded-t-md h-full flex items-end">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-[#2663eb] hover:bg-blue-700 rounded-t-md transition-all duration-300"
                />
              </div>
              <span className="text-xs font-medium text-[#707a8c] truncate max-w-[60px]">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-[#707a8c]">
        <span>Total Months: {monthlyTrends.length}</span>
        <span className="font-semibold text-[#171c29]">
          Peak Month: ${maxCost.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
