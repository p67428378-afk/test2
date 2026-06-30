import React from "react";
import PropTypes from "prop-types";

export default function KPIHeaderStrip({ kpis }) {
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
      {/* Card 1 */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] flex flex-col gap-2">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
          Sales per Linear Ft
        </span>
        <div className="font-headline-lg text-headline-lg text-on-surface">
          {formatCurrency(kpis?.sales_per_linear_ft)}
        </div>
        <div className="flex items-center text-tertiary gap-1 mt-auto">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span className="font-label-sm text-label-sm">
            +4.2% vs last week
          </span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
            Private Brand %
          </span>
          <span
            className={`px-2 py-0.5 rounded font-label-sm text-label-sm ${kpis?.private_brand_pct >= 20 ? "bg-tertiary/10 text-tertiary" : "bg-error-container text-on-error-container"}`}
          >
            {kpis?.private_brand_pct >= 20 ? "PASS" : "FAIL"}
          </span>
        </div>
        <div className="font-headline-lg text-headline-lg text-on-surface">
          {formatPercent(kpis?.private_brand_pct)}
        </div>
        <div className="font-body-sm text-body-sm text-secondary mt-auto">
          Target: &gt;20.0%
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
            In-Stock Rate
          </span>
          <span
            className={`px-2 py-0.5 rounded font-label-sm text-label-sm ${kpis?.in_stock_rate >= 95 ? "bg-tertiary/10 text-tertiary" : "bg-error-container text-on-error-container"}`}
          >
            {kpis?.in_stock_rate >= 95 ? "PASS" : "FAIL"}
          </span>
        </div>
        <div className="font-headline-lg text-headline-lg text-on-surface">
          {formatPercent(kpis?.in_stock_rate)}
        </div>
        <div className="font-body-sm text-body-sm text-secondary mt-auto">
          Target: &gt;95.0%
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
            Shelf Capacity
          </span>
          <span
            className={`px-2 py-0.5 rounded font-label-sm text-label-sm ${kpis?.shelf_capacity_pct <= 95 ? "bg-tertiary/10 text-tertiary" : "bg-error-container text-on-error-container"}`}
          >
            {kpis?.shelf_capacity_pct <= 95 ? "PASS" : "FAIL"}
          </span>
        </div>
        <div className="font-headline-lg text-headline-lg text-on-surface">
          {formatPercent(kpis?.shelf_capacity_pct)}
        </div>
        <div className="font-body-sm text-body-sm text-secondary mt-auto">
          Utilized:{" "}
          {kpis?.shelf_capacity_pct
            ? Math.round(kpis.shelf_capacity_pct * 2)
            : 0}{" "}
          / 200 ft
        </div>
      </div>
    </div>
  );
}

KPIHeaderStrip.propTypes = {
  kpis: PropTypes.shape({
    sales_per_linear_ft: PropTypes.number,
    private_brand_pct: PropTypes.number,
    in_stock_rate: PropTypes.number,
    shelf_capacity_pct: PropTypes.number,
  }),
};
