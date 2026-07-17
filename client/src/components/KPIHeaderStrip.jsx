import React from "react";

export default function KPIHeaderStrip({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter w-full">
      {/* KPI Card 1: Sales per Linear Ft */}
      <div className="card-bg border border-outline-variant rounded-lg p-5 flex flex-col justify-between h-[120px] shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start z-10">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Sales per Linear Ft
          </h3>
          <span className="material-symbols-outlined text-on-surface-variant/50 text-lg">
            straighten
          </span>
        </div>
        <div className="flex items-end justify-between z-10">
          <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
            ${kpis.sales_per_linear_ft?.toFixed(2) || "0.00"}
          </span>
          <div className="flex items-center text-primary-container font-label-md text-label-md bg-primary-container/10 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px] mr-1">
              trending_up
            </span>
            +{kpis.sales_trend_pct?.toFixed(1) || "0.0"}%
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-1 z-10">
          vs last year
        </p>
      </div>

      {/* KPI Card 2: Private Brand % */}
      <div className="card-bg border border-outline-variant rounded-lg p-5 flex flex-col justify-between h-[120px] shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start z-10">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Private Brand %
          </h3>
          <span className="material-symbols-outlined text-on-surface-variant/50 text-lg">
            local_mall
          </span>
        </div>
        <div className="flex items-end justify-between z-10">
          <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
            {kpis.private_brand_pct?.toFixed(1) || "0.0"}%
          </span>
          {kpis.private_brand_pct < kpis.private_brand_target ? (
            <div className="flex items-center text-secondary font-label-md text-label-md bg-secondary/10 px-2 py-1 rounded">
              <span className="material-symbols-outlined text-[14px] mr-1">
                warning
              </span>
              Below Tgt
            </div>
          ) : (
            <div className="flex items-center text-primary-container font-label-md text-label-md bg-primary-container/10 px-2 py-1 rounded">
              <span className="material-symbols-outlined text-[14px] mr-1">
                check_circle
              </span>
              On Track
            </div>
          )}
        </div>
        <p className="font-body-sm text-body-sm text-secondary/80 mt-1 z-10">
          Target: {kpis.private_brand_target?.toFixed(1) || "0.0"}%
        </p>
      </div>

      {/* KPI Card 3: In-Stock Rate */}
      <div className="card-bg border border-outline-variant rounded-lg p-5 flex flex-col justify-between h-[120px] shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start z-10">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            In-Stock Rate
          </h3>
          <span className="material-symbols-outlined text-on-surface-variant/50 text-lg">
            inventory
          </span>
        </div>
        <div className="flex items-end justify-between z-10">
          <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
            {kpis.in_stock_rate?.toFixed(1) || "0.0"}%
          </span>
          <div className="flex items-center text-primary-container font-label-md text-label-md bg-primary-container/10 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px] mr-1">
              check_circle
            </span>
            On Track
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-1 z-10">
          Target: {kpis.in_stock_target?.toFixed(1) || "0.0"}%
        </p>
      </div>

      {/* KPI Card 4: Shelf Capacity */}
      <div className="card-bg border border-outline-variant rounded-lg p-5 flex flex-col justify-between h-[120px] shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start z-10">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Shelf Capacity
          </h3>
          <span className="material-symbols-outlined text-on-surface-variant/50 text-lg">
            shelves
          </span>
        </div>
        <div className="flex items-end justify-between z-10">
          <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
            {kpis.shelf_capacity?.toFixed(1) || "0.0"}%
          </span>
          <div className="flex items-center text-primary-container font-label-md text-label-md bg-primary-container/10 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px] mr-1">
              check_circle
            </span>
            Optimal
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-1 z-10">
          Range: {kpis.shelf_capacity_range_min?.toFixed(0)}-
          {kpis.shelf_capacity_range_max?.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
