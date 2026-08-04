import React from "react";

export default function KPIHeaderStrip({ kpiData }) {
  const salesPerLinearFt =
    kpiData?.sales_per_linear_ft !== undefined
      ? kpiData.sales_per_linear_ft
      : 245.5;
  const privateBrandShare =
    kpiData?.private_brand_share_pct !== undefined
      ? kpiData.private_brand_share_pct
      : 28.5;
  const instockRate =
    kpiData?.instock_rate_pct !== undefined ? kpiData.instock_rate_pct : 96.2;
  const shelfCapacity =
    kpiData?.shelf_capacity_utilization_pct !== undefined
      ? kpiData.shelf_capacity_utilization_pct
      : 92.0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-density-comfortable">
      {/* KPI 1 */}
      <div className="bg-dg-slate border border-dg-slate-light rounded-lg p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Sales/Linear Ft
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            payments
          </span>
        </div>
        <div className="font-data-mono text-2xl font-bold text-on-surface mb-1">
          ${salesPerLinearFt.toFixed(2)}/ft
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-400 flex items-center font-data-mono">
            <span className="material-symbols-outlined text-[14px]">
              arrow_upward
            </span>
            4.2% YoY
          </span>
          <span className="text-on-surface-variant font-data-mono">
            Target: $230/ft
          </span>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-dg-slate border border-dg-slate-light rounded-lg p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Private Brand Share
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            loyalty
          </span>
        </div>
        <div className="font-data-mono text-2xl font-bold text-on-surface mb-1">
          {privateBrandShare.toFixed(1)}%
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-400 flex items-center font-data-mono">
            <span className="material-symbols-outlined text-[14px]">
              arrow_upward
            </span>
            1.8% YoY
          </span>
          <span className="text-on-surface-variant font-data-mono">
            Target: 25%
          </span>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-dg-slate border border-dg-slate-light rounded-lg p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            In-Stock Rate
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            inventory_2
          </span>
        </div>
        <div className="font-data-mono text-2xl font-bold text-on-surface mb-1">
          {instockRate.toFixed(1)}%
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-data-mono">Healthy</span>
          <span className="text-on-surface-variant font-data-mono">
            Target: 95%
          </span>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-dg-slate border border-dg-slate-light rounded-lg p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Shelf Capacity
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            shelves
          </span>
        </div>
        <div className="font-data-mono text-2xl font-bold text-on-surface mb-1">
          {shelfCapacity.toFixed(1)}%
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-data-mono">Optimal</span>
          <span className="text-on-surface-variant font-data-mono">
            120 Linear Ft
          </span>
        </div>
      </div>
    </div>
  );
}
