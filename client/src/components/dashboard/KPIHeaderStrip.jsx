import React from "react";

export default function KPIHeaderStrip({ kpis }) {
  const defaultKPIs = {
    sales_per_linear_ft: 15.75,
    private_brand_percentage: 22.0,
    in_stock_rate: 96.0,
    shelf_capacity_utilized: 85.0,
    sales_trend_percentage: 2.5,
  };

  const data = kpis || defaultKPIs;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
      {/* KPI 1: Sales Per Linear Ft */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-surface-variant opacity-20"></div>
        <div className="font-label-caps text-label-caps text-slate-400">
          Sales Per Linear Ft
        </div>
        <div className="flex items-end justify-between mt-auto">
          <div className="font-display-kpi text-display-kpi text-white font-bold text-4xl">
            ${data.sales_per_linear_ft?.toFixed(2)}
          </div>
          <div className="text-emerald-400 text-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              trending_up
            </span>
            +{data.sales_trend_percentage}% vs last period
          </div>
        </div>
      </div>

      {/* KPI 2: Private Brand % */}
      <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-5 flex flex-col justify-between h-32 relative overflow-hidden">
        <div className="flex justify-between items-start w-full gap-4">
          <div className="font-label-caps text-label-caps text-slate-400 shrink-0">
            Private Brand %
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded shrink-0 whitespace-nowrap">
            Below 25% Target
          </span>
        </div>
        <div className="font-display-kpi text-display-kpi text-white mt-2 font-bold text-4xl">
          {data.private_brand_percentage}%
        </div>
      </div>

      {/* KPI 3: In-Stock Rate */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col justify-between h-32">
        <div className="font-label-caps text-label-caps text-slate-400">
          In-Stock Rate
        </div>
        <div className="flex items-center gap-3 mt-auto">
          <div className="font-display-kpi text-display-kpi text-white font-bold text-4xl">
            {data.in_stock_rate}%
          </div>
          <span
            className="material-symbols-outlined text-[#10b981] text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
      </div>

      {/* KPI 4: Shelf Capacity */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col justify-between h-32">
        <div className="font-label-caps text-label-caps text-slate-400">
          Shelf Capacity
        </div>
        <div className="mt-auto">
          <div className="font-display-kpi text-[24px] font-bold text-white mb-2">
            {data.shelf_capacity_utilized}% Utilized
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${data.shelf_capacity_utilized}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
