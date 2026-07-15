import React from "react";

export default function KPIHeaderStrip({ kpis, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="dg-card rounded-xl p-4 h-28 bg-slate-800/50"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error">
        <p className="font-semibold">Failed to load KPIs</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const data = kpis || {
    sales_per_linear_ft: 15.75,
    private_brand_percentage: 28.4,
    in_stock_rate: 96.2,
    shelf_capacity: 84.0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
      {/* KPI 1 */}
      <div className="dg-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-t-2 hover:border-t-dg-amber transition-all">
        <div className="flex justify-between items-start">
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
            Sales per Linear Ft
          </span>
          <span className="material-symbols-outlined text-secondary text-sm">
            trending_up
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-headline-lg font-headline-lg text-on-surface">
            ${data.sales_per_linear_ft?.toFixed(2)}
          </span>
          <span className="text-label-sm font-label-sm text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
            +8.2%
          </span>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="dg-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-t-2 hover:border-t-dg-amber transition-all">
        <div className="flex justify-between items-start">
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
            Private Brand %
          </span>
          <span className="material-symbols-outlined text-primary text-sm">
            warning
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-headline-lg font-headline-lg text-primary">
            {data.private_brand_percentage?.toFixed(1)}%
          </span>
        </div>
        <span className="text-label-sm font-label-sm text-on-surface-variant mt-1">
          Goal: 30.0%
        </span>
      </div>

      {/* KPI 3 */}
      <div className="dg-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-t-2 hover:border-t-dg-amber transition-all">
        <div className="flex justify-between items-start">
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
            In-Stock Rate
          </span>
          <span className="material-symbols-outlined text-secondary text-sm">
            check_circle
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-headline-lg font-headline-lg text-on-surface">
            {data.in_stock_rate?.toFixed(1)}%
          </span>
        </div>
        <span className="text-label-sm font-label-sm text-on-surface-variant mt-1">
          Goal: 95.0%
        </span>
      </div>

      {/* KPI 4 */}
      <div className="dg-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-t-2 hover:border-t-dg-amber transition-all">
        <div className="flex justify-between items-start">
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
            Shelf Capacity
          </span>
          <span className="material-symbols-outlined text-secondary text-sm">
            check_circle
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-headline-lg font-headline-lg text-on-surface">
            {data.shelf_capacity?.toFixed(1)}%
          </span>
        </div>
        <span className="text-label-sm font-label-sm text-secondary mt-1">
          Optimal
        </span>
      </div>
    </div>
  );
}
