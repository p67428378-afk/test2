import React from "react";

export default function KPIHeaderStrip({ kpis }) {
  const business = kpis?.business_per_branch || "₹42.5 Cr";
  const casa = kpis?.casa_ratio !== undefined ? `${kpis.casa_ratio}%` : "38.4%";
  const uptime =
    kpis?.product_availability_rate !== undefined
      ? `${kpis.product_availability_rate}%`
      : "99.85%";
  const utilization =
    kpis?.capacity_utilization !== undefined
      ? `${kpis.capacity_utilization}%`
      : "78.2%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* KPI 1 */}
      <div className="bg-surface-container border border-outline-variant p-5 rounded-lg flex flex-col gap-2">
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Avg Business
        </p>
        <div className="flex items-end justify-between">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">
            {business}
          </span>
          <span className="font-data-mono text-data-mono text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">
            +8.2% YoY
          </span>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-surface-container border border-outline-variant p-5 rounded-lg flex flex-col gap-2">
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          CASA Ratio
        </p>
        <div className="flex items-end justify-between">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">
            {casa}
          </span>
          <span className="font-data-mono text-data-mono text-secondary px-2 py-0.5 rounded text-xs">
            Target &gt;35.0%
          </span>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-surface-container border border-outline-variant p-5 rounded-lg flex flex-col gap-2">
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Scheme Availability
        </p>
        <div className="flex items-end justify-between">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">
            {uptime}
          </span>
          <span className="font-data-mono text-data-mono text-secondary px-2 py-0.5 rounded text-xs">
            Uptime
          </span>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-surface-container border border-outline-variant p-5 rounded-lg flex flex-col gap-2">
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          Capacity Utilization
        </p>
        <div className="flex items-end justify-between">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">
            {utilization}
          </span>
          <span className="font-data-mono text-data-mono text-tertiary px-2 py-0.5 rounded text-xs bg-tertiary/10">
            Optimal
          </span>
        </div>
      </div>
    </div>
  );
}
