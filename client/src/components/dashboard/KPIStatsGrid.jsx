import React from "react";

export default function KPIStatsGrid({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-grid-gutter">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-container-low border border-outline-variant rounded-lg p-lg animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  const totalSwept =
    stats?.total_swept_usd !== undefined
      ? `$${(stats.total_swept_usd / 1e6).toFixed(2)}M`
      : "$0.00M";
  const activeRules =
    stats?.active_rules_count !== undefined
      ? `${stats.active_rules_count} Rules`
      : "0 Rules";
  const activeHedges =
    stats?.active_hedges_count !== undefined
      ? `${stats.active_hedges_count} Contracts`
      : "0 Contracts";
  const idleCash =
    stats?.idle_cash_minimized_usd !== undefined
      ? `${stats.idle_cash_minimized_usd.toFixed(1)}%`
      : "0.0%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-grid-gutter">
      {/* KPI 1 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-xs">
          Total Swept (EOD)
        </h3>
        <div className="flex items-baseline gap-sm mb-md">
          <span className="font-display-lg text-display-lg font-bold text-on-surface font-mono">
            {totalSwept}
          </span>
        </div>
        <div className="flex items-center gap-base">
          <span className="inline-flex items-center bg-tertiary/10 text-tertiary font-label-caps px-2 py-1 rounded-sm">
            <span className="material-symbols-outlined text-[14px] mr-1">
              trending_up
            </span>{" "}
            +8.2%
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            vs last week
          </span>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-xs">
          Active Sweep Rules
        </h3>
        <div className="flex items-baseline gap-sm mb-md">
          <span className="font-display-lg text-display-lg font-bold text-on-surface font-mono">
            {activeRules}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          EUR, GBP, JPY, CAD, etc.
        </p>
      </div>

      {/* KPI 3 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-xs">
          Active Hedges
        </h3>
        <div className="flex items-baseline gap-sm mb-md">
          <span className="font-display-lg text-display-lg font-bold text-on-surface font-mono">
            {activeHedges}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Forward contracts
        </p>
      </div>

      {/* KPI 4 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
        <div className="flex justify-between items-start mb-xs">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Idle Cash Minimized
          </h3>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Target: &gt;95%
          </span>
        </div>
        <div className="flex items-baseline gap-sm mb-md">
          <span className="font-display-lg text-display-lg font-bold text-on-surface font-mono">
            {idleCash}
          </span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-tertiary h-1.5 rounded-full"
            style={{ width: idleCash }}
          />
        </div>
      </div>
    </div>
  );
}
