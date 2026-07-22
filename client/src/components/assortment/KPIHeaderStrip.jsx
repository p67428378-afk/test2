import React from "react";

export default function KPIHeaderStrip({ kpis, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="surface-l1 rounded-xl p-4 flex flex-col justify-between h-28 animate-pulse"
          >
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4 mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
        Failed to load KPI metrics. Using fallback values.
      </div>
    );
  }

  const data = kpis || {
    sales_per_linear_ft: 152.5,
    private_brand_percentage: 18.75,
    in_stock_rate: 94.2,
    shelf_capacity_utilized: 88.0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* KPI 1 */}
      <div className="surface-l1 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Sales per Linear Ft
          </h3>
          <span className="material-symbols-outlined text-slate-500 text-sm">
            payments
          </span>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <div className="text-xl font-semibold text-white">
            $
            {typeof data.sales_per_linear_ft === "number"
              ? data.sales_per_linear_ft.toFixed(2)
              : data.sales_per_linear_ft}
          </div>
          <div className="flex items-center text-emerald-400 font-mono text-xs">
            <span className="material-symbols-outlined text-[14px]">
              arrow_upward
            </span>
            +4.2%
          </div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="surface-l1 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Private Brand %
          </h3>
          <span className="material-symbols-outlined text-slate-500 text-sm">
            local_offer
          </span>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <div className="text-xl font-semibold text-white">
            {typeof data.private_brand_percentage === "number"
              ? data.private_brand_percentage.toFixed(2)
              : data.private_brand_percentage}
            %
          </div>
          <div className="text-slate-400 font-mono text-xs">Target: 20.0%</div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-slate-700 w-full">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${Math.min(100, (data.private_brand_percentage / 20.0) * 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="surface-l1 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            In-Stock Rate
          </h3>
          <span className="material-symbols-outlined text-slate-500 text-sm">
            inventory
          </span>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <div className="text-xl font-semibold text-white">
            {typeof data.in_stock_rate === "number"
              ? data.in_stock_rate.toFixed(1)
              : data.in_stock_rate}
            %
          </div>
          <div className="text-slate-400 font-mono text-xs">Target: 95.0%</div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-slate-700 w-full">
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{
              width: `${Math.min(100, (data.in_stock_rate / 95.0) * 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="surface-l1 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Shelf Capacity
          </h3>
          <span className="material-symbols-outlined text-slate-500 text-sm">
            shelves
          </span>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <div className="text-xl font-semibold text-white">
            {typeof data.shelf_capacity_utilized === "number"
              ? data.shelf_capacity_utilized.toFixed(1)
              : data.shelf_capacity_utilized}
            %
          </div>
          <div className="text-slate-400 font-mono text-xs">Utilized</div>
        </div>
      </div>
    </div>
  );
}
