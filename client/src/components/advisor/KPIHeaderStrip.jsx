import React from "react";
import { TrendingUp } from "lucide-react";
import Badge from "../common/Badge.jsx";

export default function KPIHeaderStrip({ kpis, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface border border-outline-variant rounded-xl p-4 animate-pulse h-32 flex flex-col justify-between"
          >
            <div className="h-4 bg-surface-container rounded w-1/2"></div>
            <div className="h-8 bg-surface-container rounded w-3/4"></div>
            <div className="h-4 bg-surface-container rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error-container/30">
        Failed to load KPI metrics. Please try again later.
      </div>
    );
  }

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  const formatPercent = (val) => {
    if (val === undefined || val === null) return "0.0%";
    return `${val.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Sales per Linear Ft */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col gap-3">
        <span className="text-label-md text-secondary uppercase tracking-wider font-semibold">
          Sales per Linear Ft
        </span>
        <div className="text-headline-lg font-black text-on-surface leading-none">
          {formatCurrency(kpis?.sales_per_linear_ft || 1245.5)}
        </div>
        <div className="flex items-center text-tertiary gap-1 mt-auto pt-1">
          <TrendingUp className="w-4 h-4" />
          <span className="text-label-sm font-semibold">
            +4.2% vs last week
          </span>
        </div>
      </div>

      {/* Card 2: Private Brand % */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center gap-2">
          <span className="text-label-md text-secondary uppercase tracking-wider font-semibold">
            Private Brand %
          </span>
          <Badge status="PASS" className="shrink-0" />
        </div>
        <div className="text-headline-lg font-black text-on-surface leading-none">
          {formatPercent(kpis?.private_brand_pct || 24.2)}
        </div>
        <div className="text-body-sm text-secondary mt-auto pt-1">
          Target: &gt;20.0%
        </div>
      </div>

      {/* Card 3: In-Stock Rate */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center gap-2">
          <span className="text-label-md text-secondary uppercase tracking-wider font-semibold">
            In-Stock Rate
          </span>
          <Badge status="PASS" className="shrink-0" />
        </div>
        <div className="text-headline-lg font-black text-on-surface leading-none">
          {formatPercent(kpis?.in_stock_rate || 96.8)}
        </div>
        <div className="text-body-sm text-secondary mt-auto pt-1">
          Target: &gt;95.0%
        </div>
      </div>

      {/* Card 4: Shelf Capacity */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center gap-2">
          <span className="text-label-md text-secondary uppercase tracking-wider font-semibold">
            Shelf Capacity
          </span>
          <Badge status="PASS" className="shrink-0" />
        </div>
        <div className="text-headline-lg font-black text-on-surface leading-none">
          {formatPercent(kpis?.shelf_capacity || 88.5)}
        </div>
        <div className="text-body-sm text-secondary mt-auto pt-1">
          Utilized: 177 / 200 ft
        </div>
      </div>
    </div>
  );
}
