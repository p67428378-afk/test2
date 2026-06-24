import React from "react";
import PropTypes from "prop-types";

export default function KPIHeaderStrip({ kpis, loading }) {
  if (loading || !kpis) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack_md"
        data-testid="kpi-loading"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="card-surface rounded-lg p-card_padding animate-pulse h-32 bg-surface-container-low"
          ></div>
        ))}
      </div>
    );
  }

  const {
    business_per_branch,
    casa_ratio,
    scheme_availability_rate,
    capacity_utilization,
  } = kpis;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack_md">
      {/* KPI 1 */}
      <div className="card-surface rounded-lg p-card_padding flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-mono text-slate-muted text-xs">
            BUSINESS PER BRANCH
          </span>
          <span className="material-symbols-outlined text-slate-muted text-[18px]">
            account_balance
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-on-surface font-bold text-2xl">
              {business_per_branch || "₹0.0 Cr"}
            </span>
            <span className="font-label-mono text-emerald-status flex items-center text-xs">
              <span className="material-symbols-outlined text-[14px]">
                arrow_upward
              </span>
              4.2%
            </span>
          </div>
          <p className="font-body-sm text-slate-muted mt-1 text-xs">
            Target: ₹1.0 Cr
          </p>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="card-surface rounded-lg p-card_padding flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-mono text-slate-muted text-xs">
            CASA RATIO
          </span>
          <span className="material-symbols-outlined text-slate-muted text-[18px]">
            pie_chart
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-on-surface font-bold text-2xl">
              {casa_ratio !== undefined ? `${casa_ratio}%` : "0.0%"}
            </span>
            <span className="font-label-mono text-emerald-status flex items-center text-xs">
              <span className="material-symbols-outlined text-[14px]">
                arrow_upward
              </span>
              1.8%
            </span>
          </div>
          <p className="font-body-sm text-slate-muted mt-1 text-xs">
            Reg Floor: 35.0%
          </p>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="card-surface rounded-lg p-card_padding flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-mono text-slate-muted text-xs">
            SCHEME AVAILABILITY
          </span>
          <span className="material-symbols-outlined text-slate-muted text-[18px]">
            check_circle
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-on-surface font-bold text-2xl">
              {scheme_availability_rate !== undefined
                ? `${scheme_availability_rate}%`
                : "0.0%"}
            </span>
            <span className="font-label-mono text-emerald-status flex items-center text-xs">
              Stable
            </span>
          </div>
          <p className="font-body-sm text-slate-muted mt-1 text-xs">
            Target: 99.5%
          </p>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="card-surface rounded-lg p-card_padding flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-mono text-slate-muted text-xs">
            CAPACITY UTILIZATION
          </span>
          <span className="material-symbols-outlined text-slate-muted text-[18px]">
            group
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-on-surface font-bold text-2xl">
              {capacity_utilization !== undefined
                ? `${capacity_utilization}%`
                : "0%"}
            </span>
            <span className="font-label-mono text-amber-status flex items-center text-xs">
              High Load
            </span>
          </div>
          <p className="font-body-sm text-slate-muted mt-1 text-xs">
            Counter/RM Capacity
          </p>
        </div>
      </div>
    </div>
  );
}

KPIHeaderStrip.propTypes = {
  kpis: PropTypes.shape({
    business_per_branch: PropTypes.string,
    casa_ratio: PropTypes.number,
    scheme_availability_rate: PropTypes.number,
    capacity_utilization: PropTypes.number,
  }),
  loading: PropTypes.bool,
};
