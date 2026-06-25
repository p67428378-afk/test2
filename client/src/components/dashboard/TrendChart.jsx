import React from "react";

export default function TrendChart({ trendData, loading }) {
  if (loading) {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg flex flex-col min-h-[360px] animate-pulse" />
    );
  }

  const maxAmount =
    trendData && trendData.length > 0
      ? Math.max(...trendData.map((d) => d.amount))
      : 1;

  return (
    <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant rounded-lg p-lg flex flex-col min-h-[360px]">
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
            Daily Cash Concentration Trend
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Last 7 days, USD equiv
          </p>
        </div>
      </div>
      <div className="flex-1 relative w-full h-full bg-surface-container-highest/20 rounded-md border border-outline-variant/30 flex items-end px-4 pb-4 pt-8 gap-2 min-h-[200px]">
        {trendData &&
          trendData.map((item, idx) => {
            const heightPercent =
              maxAmount > 0 ? (item.amount / maxAmount) * 85 : 10;
            return (
              <div
                key={idx}
                className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm relative group"
                style={{ height: `${heightPercent}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${(item.amount / 1e6).toFixed(2)}M
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-sans text-[10px] text-on-surface-variant whitespace-nowrap">
                  {item.date}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
