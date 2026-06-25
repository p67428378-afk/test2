import React from "react";

export default function KPIHeaderStrip({ kpis }) {
  const businessPerBranch = kpis
    ? `₹${(kpis.business_per_branch / 1000000).toFixed(1)} Cr`
    : "₹42.5 Cr";
  const casaRatio = kpis ? `${kpis.casa_ratio}%` : "38.4%";
  const schemeAvailability = kpis ? `${kpis.scheme_availability}%` : "99.85%";
  const capacityUtilization = kpis ? `${kpis.capacity_utilization}%` : "84.2%";

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Card 1 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-primary-fixed-dim transition-colors">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
        <div className="flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant">
            Business per Branch
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
            storefront
          </span>
        </div>
        <div className="flex items-end gap-3 mt-2">
          <span className="font-headline-lg text-headline-lg text-on-surface">
            {businessPerBranch}
          </span>
          <div className="flex items-center text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded-full text-xs font-medium mb-1">
            <span className="material-symbols-outlined text-[14px] mr-0.5">
              trending_up
            </span>
            +8.2% YoY
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-tertiary-container transition-colors">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/5 rounded-full blur-xl group-hover:bg-tertiary-container/10 transition-colors"></div>
        <div className="flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant">
            CASA Ratio %
          </span>
          <span className="material-symbols-outlined text-tertiary-container text-[20px]">
            account_balance
          </span>
        </div>
        <div className="flex items-end gap-3 mt-2">
          <span className="font-headline-lg text-headline-lg text-on-surface">
            {casaRatio}
          </span>
          <span className="font-body-md text-body-md text-tertiary-container mb-1">
            Target 40.0%
          </span>
        </div>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-tertiary-container h-full rounded-full"
            style={{ width: kpis ? `${kpis.casa_ratio}%` : "85%" }}
          ></div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-[#4ade80] transition-colors">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#4ade80]/5 rounded-full blur-xl group-hover:bg-[#4ade80]/10 transition-colors"></div>
        <div className="flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant">
            Scheme Availability
          </span>
          <span className="material-symbols-outlined text-[#4ade80] text-[20px]">
            check_circle
          </span>
        </div>
        <div className="flex items-end gap-3 mt-2">
          <span className="font-headline-lg text-headline-lg text-on-surface">
            {schemeAvailability}
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant text-xs mt-1">
          Uptime across 124 rural branches
        </p>
      </div>

      {/* Card 4 */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-secondary-fixed-dim transition-colors">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-fixed-dim/5 rounded-full blur-xl group-hover:bg-secondary-fixed-dim/10 transition-colors"></div>
        <div className="flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant">
            Capacity Utilization
          </span>
          <span className="material-symbols-outlined text-secondary-fixed-dim text-[20px]">
            data_usage
          </span>
        </div>
        <div className="flex items-end gap-3 mt-2">
          <span className="font-headline-lg text-headline-lg text-on-surface">
            {capacityUtilization}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <div className="h-1.5 flex-1 bg-secondary-fixed-dim rounded-l-full"></div>
          <div className="h-1.5 flex-1 bg-secondary-fixed-dim/40"></div>
          <div className="h-1.5 flex-1 bg-secondary-fixed-dim/40"></div>
          <div className="h-1.5 flex-1 bg-surface-container-high rounded-r-full"></div>
        </div>
      </div>
    </section>
  );
}
