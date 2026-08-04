import React from "react";
import { useAssortment } from "../../context/AssortmentContext.jsx";

export default function KPIHeaderStrip() {
  const { kpis } = useAssortment();

  const salesPerLinFt =
    kpis?.sales_per_linear_ft || kpis?.sales_per_linear_foot
      ? `$${Number(kpis.sales_per_linear_ft || kpis.sales_per_linear_foot).toFixed(2)}`
      : "$142.50";
  const pbMix = kpis?.private_brand_mix_pct
    ? `${kpis.private_brand_mix_pct}%`
    : "28.5%";
  const inStock = kpis?.in_stock_rate_pct
    ? `${kpis.in_stock_rate_pct}%`
    : "96.2%";
  const shelfCapacity = kpis?.shelf_capacity_utilization_pct
    ? `${kpis.shelf_capacity_utilization_pct}%`
    : "94.0%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* KPI Card 1 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider relative z-10">
          Sales / Lin Ft
        </span>
        <div className="mt-2 flex items-baseline gap-2 relative z-10">
          <span className="text-2xl font-bold text-white">{salesPerLinFt}</span>
        </div>
        <div className="flex items-center gap-1 mt-auto relative z-10">
          <span className="material-symbols-outlined text-base text-emerald-400">
            trending_up
          </span>
          <span className="text-xs text-emerald-400 font-semibold">
            +4.2% vs YA
          </span>
        </div>
      </div>

      {/* KPI Card 2 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider relative z-10">
          Private Brand Mix
        </span>
        <div className="mt-2 flex items-baseline gap-2 relative z-10">
          <span className="text-2xl font-bold text-white">{pbMix}</span>
        </div>
        <div className="flex items-center gap-1 mt-auto relative z-10">
          <span className="material-symbols-outlined text-base text-emerald-400">
            trending_up
          </span>
          <span className="text-xs text-emerald-400 font-semibold">
            +1.5 pts vs Target
          </span>
        </div>
      </div>

      {/* KPI Card 3 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider relative z-10">
          In-Stock Rate
        </span>
        <div className="mt-2 flex items-baseline gap-2 relative z-10">
          <span className="text-2xl font-bold text-white">{inStock}</span>
        </div>
        <div className="flex items-center gap-1 mt-auto relative z-10">
          <span className="material-symbols-outlined text-base text-rose-400">
            trending_down
          </span>
          <span className="text-xs text-rose-400 font-semibold">
            -0.8% vs YA
          </span>
        </div>
      </div>

      {/* KPI Card 4 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider relative z-10">
          Shelf Capacity
        </span>
        <div className="mt-2 flex items-baseline gap-2 relative z-10">
          <span className="text-2xl font-bold text-white">{shelfCapacity}</span>
        </div>
        <div className="flex items-center gap-1 mt-auto relative z-10">
          <span className="material-symbols-outlined text-base text-slate-400">
            horizontal_rule
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Optimal Range
          </span>
        </div>
      </div>
    </div>
  );
}
