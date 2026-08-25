import React from "react";
import { TrendingUp, BarChart3, PieChart } from "lucide-react";

export default function AnalyticsTrendCard({
  monthlyTrend = [],
  categoryBreakdown = [],
  isLoading = false,
}) {
  const maxTrendAmount = Math.max(
    ...monthlyTrend.map((t) => Math.max(t.total_amount, t.budget_limit || 0)),
    100,
  );

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-6 w-full">
      {/* Monthly Trend Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#2663eb] rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171c29]">
                Monthly Spending Trend
              </h3>
              <p className="text-xs text-[#707a8c]">
                Historical expenditures over recent billing periods
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#f2f5fa] text-[#707a8c] rounded-md">
            Last {monthlyTrend.length} Months
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-xs text-[#707a8c]">
            Loading trend data...
          </div>
        ) : monthlyTrend.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#707a8c]">
            No historical trend data available yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {monthlyTrend.map((item, idx) => {
                const isCurrent = idx === monthlyTrend.length - 1;
                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isCurrent
                        ? "bg-blue-50/60 border-[#2663eb]/40 shadow-xs"
                        : "bg-[#f7fafc] border-[#e3e8f0]"
                    }`}
                  >
                    <p className="text-xs font-medium text-[#707a8c]">
                      {item.period}
                    </p>
                    <p
                      className={`text-sm font-bold mt-1 ${
                        isCurrent ? "text-[#2663eb]" : "text-[#171c29]"
                      }`}
                    >
                      ${Number(item.total_amount).toFixed(0)}
                    </p>
                    {item.budget_limit > 0 && (
                      <p className="text-[10px] text-[#707a8c] mt-0.5">
                        Cap: ${Number(item.budget_limit).toFixed(0)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Visual Bar Comparison */}
            <div className="mt-2 pt-3 border-t border-[#e3e8f0] flex items-end justify-between gap-2 h-32 px-2">
              {monthlyTrend.map((item, idx) => {
                const heightPct = Math.min(
                  Math.round((item.total_amount / maxTrendAmount) * 100),
                  100,
                );
                const isCurrent = idx === monthlyTrend.length - 1;
                return (
                  <div
                    key={`bar-${item.year}-${item.month}`}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                  >
                    <span className="text-[10px] font-semibold text-[#171c29] opacity-0 group-hover:opacity-100 transition-opacity">
                      ${Number(item.total_amount).toFixed(0)}
                    </span>
                    <div
                      className={`w-full max-w-[42px] rounded-t-md transition-all duration-500 ${
                        isCurrent
                          ? "bg-[#2663eb] shadow-sm"
                          : "bg-[#94b8ff] hover:bg-[#2663eb]/80"
                      }`}
                      style={{ height: `${Math.max(heightPct, 6)}%` }}
                    />
                    <span className="text-[10px] font-medium text-[#707a8c] truncate">
                      {item.period.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown Distribution */}
      {categoryBreakdown.length > 0 && (
        <div className="pt-4 border-t border-[#e3e8f0]">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-[#2663eb]" />
            <h4 className="text-sm font-bold text-[#171c29]">
              Spending by Category
            </h4>
          </div>

          <div className="flex flex-col gap-2">
            {categoryBreakdown.map((cat) => (
              <div
                key={cat.category_id}
                className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md hover:bg-[#f7fafc]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.category_color || "#2663eb" }}
                  />
                  <span className="font-medium text-[#171c29]">
                    {cat.category_name}
                  </span>
                  <span className="text-[#707a8c] text-[11px]">
                    ({cat.transaction_count} tx)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#171c29]">
                    ${Number(cat.total_amount).toFixed(2)}
                  </span>
                  <span className="text-[#707a8c] font-medium w-10 text-right">
                    {Number(cat.percentage).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
