import React from "react";
import KPICard from "./KPICard";

export default function HeaderStrip({ kpis }) {
  const sales = kpis?.sales_per_linear_ft || { value: 425.5, trend_yoy: 4.2 };
  const privateBrand = kpis?.private_brand_pct || { value: 28.4, target: 30.0 };
  const inStock = kpis?.in_stock_rate || { value: 96.2, status: "Healthy" };
  const shelfCapacity = kpis?.shelf_capacity_pct || {
    value: 92.1,
    remaining_ft: 9.2,
  };

  return (
    <header className="w-full bg-surface-card border-b border-subtle px-lg py-md flex flex-col gap-sm shrink-0">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary-container">
          DG Cluster Assortment Advisor
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Small Town Value Cluster — Snacks Category
        </p>
      </div>
      <div className="grid grid-cols-4 gap-gutter mt-sm">
        <KPICard
          title="Sales per Linear Ft"
          value={`$${sales.value.toFixed(2)}`}
          borderClass="border-t-2 border-[#10B981]"
          subElement={
            <span className="font-label-caps text-label-caps text-semantic-success flex items-center">
              <span className="material-symbols-outlined text-[14px] mr-0.5">
                arrow_upward
              </span>
              {sales.trend_yoy}% YoY
            </span>
          }
        />
        <KPICard
          title="Private Brand %"
          value={`${privateBrand.value.toFixed(1)}%`}
          subElement={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Target: {privateBrand.target.toFixed(1)}%
            </span>
          }
        />
        <KPICard
          title="In-Stock Rate"
          value={`${inStock.value.toFixed(1)}%`}
          borderClass="border-t-2 border-[#10B981]"
          subElement={
            <span className="font-body-sm text-body-sm text-semantic-success">
              {inStock.status}
            </span>
          }
        />
        <KPICard
          title="Shelf Capacity"
          value={`${shelfCapacity.value.toFixed(1)}%`}
          subElement={
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {shelfCapacity.remaining_ft.toFixed(1)} ft rem.
            </span>
          }
        />
      </div>
    </header>
  );
}
