import React from "react";

export default function KPIGrid({ summary }) {
  const { is_roundup_enabled, total_roundup_amount } = summary || {
    is_roundup_enabled: false,
    today_invested_amount: 0,
    total_roundup_amount: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
      {/* KPI 1 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 hover:border-primary/50 transition-colors relative overflow-hidden group">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-label-md text-label-md text-on-surface-variant">
            Total Portfolio Value
          </h3>
          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            <span className="text-xs font-bold">+8.4%</span>
          </div>
        </div>
        <div className="font-display-lg text-display-lg text-on-surface">
          $12,450.80
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* KPI 2 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 hover:border-outline transition-colors">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-label-md text-label-md text-on-surface-variant">
            Total from Round-Ups
          </h3>
          <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            Passive Savings
          </span>
        </div>
        <div
          className="font-headline-lg text-headline-lg text-on-surface mt-1"
          data-testid="total-roundups"
        >
          ${total_roundup_amount.toFixed(2)}
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 hover:border-outline transition-colors flex flex-col justify-center items-center text-center">
        <h3 className="font-label-md text-label-md text-on-surface-variant mb-3">
          Active Round-Up Status
        </h3>
        <div
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md font-bold tracking-wide flex items-center gap-2 ${
            is_roundup_enabled
              ? "bg-primary/15 text-primary"
              : "bg-error/15 text-error"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              is_roundup_enabled
                ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"
                : "bg-error"
            }`}
          ></span>
          {is_roundup_enabled ? "ENABLED" : "DISABLED"}
        </div>
      </div>
    </div>
  );
}
