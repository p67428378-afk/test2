import React from "react";
import PropTypes from "prop-types";

export default function KPIHeaderStrip({ kpis }) {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 h-28"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* KPI Card 1 */}
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 hover:border-primary-container hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col gap-2">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          Business per Branch
        </span>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-on-surface">
            {kpis.business_per_branch}
          </span>
          <div className="flex items-center gap-1 bg-primary-container/10 text-primary-container px-2 py-1 rounded text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">
              trending_up
            </span>
            +8.2% YoY
          </div>
        </div>
      </div>

      {/* KPI Card 2 */}
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 hover:border-primary-container hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col gap-2">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          CASA Ratio %
        </span>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-on-surface">
            {kpis.casa_ratio}%
          </span>
          <div className="flex items-center gap-1 bg-primary-container/10 text-primary-container px-2 py-1 rounded text-xs font-semibold">
            Target: 35.0%
          </div>
        </div>
      </div>

      {/* KPI Card 3 */}
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 hover:border-primary-container hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col gap-2">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          Scheme Availability
        </span>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-on-surface">
            {kpis.availability_rate}%
          </span>
          <div className="flex items-center gap-1 bg-primary-container/10 text-primary-container px-2 py-1 rounded text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">
              check_circle
            </span>
            Optimal
          </div>
        </div>
      </div>

      {/* KPI Card 4 */}
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 hover:border-primary-container hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-col gap-2">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          Capacity Utilization
        </span>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-on-surface">
            {kpis.capacity_utilization}%
          </span>
          <div className="flex items-center gap-1 bg-[#F59E0B]/10 text-[#D97706] px-2 py-1 rounded text-xs font-semibold">
            Balanced
          </div>
        </div>
      </div>
    </div>
  );
}

KPIHeaderStrip.propTypes = {
  kpis: PropTypes.shape({
    business_per_branch: PropTypes.string.isRequired,
    casa_ratio: PropTypes.number.isRequired,
    availability_rate: PropTypes.number.isRequired,
    capacity_utilization: PropTypes.number.isRequired,
  }),
};
