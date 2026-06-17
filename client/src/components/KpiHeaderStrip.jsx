import React from "react";
import PropTypes from "prop-types";

export default function KpiHeaderStrip({ kpis, loading }) {
  if (loading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card border border-subtle rounded-xl p-card-padding flex flex-col justify-between h-24 animate-pulse"
          >
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4 mt-2"></div>
          </div>
        ))}
      </section>
    );
  }

  const business =
    kpis?.business_per_branch !== undefined
      ? `₹${kpis.business_per_branch} Cr`
      : "₹0 Cr";
  const casa = kpis?.casa_ratio !== undefined ? `${kpis.casa_ratio}%` : "0%";
  const availability =
    kpis?.product_availability !== undefined
      ? `${kpis.product_availability}%`
      : "0%";
  const utilization =
    kpis?.capacity_utilization !== undefined
      ? `${kpis.capacity_utilization}%`
      : "0%";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-4">
      {/* Card 1 */}
      <div className="bg-card border border-subtle rounded-xl p-card-padding flex flex-col justify-between h-24">
        <div className="flex justify-between items-start">
          <h3 className="text-muted font-label-sm text-label-sm uppercase tracking-wider">
            Business per Branch
          </h3>
          <span className="material-symbols-outlined text-muted text-[18px]">
            account_balance
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-headline-lg text-headline-lg text-[#F8FAFC]">
            {business}
          </span>
          <span className="bg-[#059669]/10 text-[#34D399] font-label-sm text-label-sm px-1.5 py-0.5 rounded flex items-center">
            <span className="material-symbols-outlined text-[12px] mr-0.5">
              trending_up
            </span>
            +4.2% YoY
          </span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-card border border-subtle rounded-xl p-card-padding flex flex-col justify-between h-24">
        <div className="flex justify-between items-start">
          <h3 className="text-muted font-label-sm text-label-sm uppercase tracking-wider">
            CASA Ratio
          </h3>
          <span className="material-symbols-outlined text-muted text-[18px]">
            pie_chart
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-headline-lg text-headline-lg text-[#F8FAFC]">
            {casa}
          </span>
          <span className="bg-[#059669]/10 text-[#34D399] font-label-sm text-label-sm px-1.5 py-0.5 rounded flex items-center">
            <span className="material-symbols-outlined text-[12px] mr-0.5">
              arrow_upward
            </span>
            +1.5% vs Target
          </span>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-card border border-subtle rounded-xl p-card-padding flex flex-col justify-between h-24">
        <div className="flex justify-between items-start">
          <h3 className="text-muted font-label-sm text-label-sm uppercase tracking-wider">
            Product Availability
          </h3>
          <span className="material-symbols-outlined text-muted text-[18px]">
            inventory_2
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-headline-lg text-headline-lg text-[#F8FAFC]">
            {availability}
          </span>
          <span className="bg-[#059669]/10 text-[#34D399] font-label-sm text-label-sm px-1.5 py-0.5 rounded">
            Optimal
          </span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-card border border-subtle rounded-xl p-card-padding flex flex-col justify-between h-24">
        <div className="flex justify-between items-start">
          <h3 className="text-muted font-label-sm text-label-sm uppercase tracking-wider">
            Capacity Utilization
          </h3>
          <span className="material-symbols-outlined text-muted text-[18px]">
            speed
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-headline-lg text-headline-lg text-[#F8FAFC]">
            {utilization}
          </span>
          <span className="bg-[#D97706]/10 text-[#FBBF24] font-label-sm text-label-sm px-1.5 py-0.5 rounded">
            High
          </span>
        </div>
      </div>
    </section>
  );
}

KpiHeaderStrip.propTypes = {
  kpis: PropTypes.shape({
    business_per_branch: PropTypes.number,
    casa_ratio: PropTypes.number,
    product_availability: PropTypes.number,
    capacity_utilization: PropTypes.number,
  }),
  loading: PropTypes.bool,
};
