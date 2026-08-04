import React from "react";
import { useAssortment } from "../context/AssortmentContext.jsx";

export default function KPIHeaderStrip() {
  const { kpis } = useAssortment();

  const salesPerLinFt = kpis?.sales_per_linear_ft
    ? `$${Number(kpis.sales_per_linear_ft).toFixed(2)}`
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#475569] transition-colors">
        <div className="font-label-md text-on-surface-variant flex justify-between items-center text-xs text-slate-400">
          <span>Sales per Linear Ft</span>
          <span className="material-symbols-outlined text-[16px]">
            show_chart
          </span>
        </div>
        <div className="font-headline-md text-on-surface text-2xl font-bold text-white">
          {salesPerLinFt}{" "}
          <span className="font-body-sm text-on-surface-variant text-xs font-normal text-slate-400">
            / lin ft
          </span>
        </div>
        <div className="flex items-center gap-1 font-label-sm text-dg-emerald text-xs text-emerald-400 font-semibold">
          <span className="material-symbols-outlined text-[14px]">
            arrow_upward
          </span>
          <span>+4.2% trend</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#475569] transition-colors">
        <div className="font-label-md text-on-surface-variant flex justify-between items-center text-xs text-slate-400">
          <span>Private Brand Mix</span>
          <span className="material-symbols-outlined text-[16px]">
            pie_chart
          </span>
        </div>
        <div className="font-headline-md text-on-surface text-2xl font-bold text-white">
          {pbMix}
        </div>
        <div className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-label-sm text-xs border border-emerald-500/20 font-semibold">
          Optimal
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#475569] transition-colors">
        <div className="font-label-md text-on-surface-variant flex justify-between items-center text-xs text-slate-400">
          <span>In-Stock Rate</span>
          <span className="material-symbols-outlined text-[16px]">
            inventory
          </span>
        </div>
        <div className="font-headline-md text-on-surface text-2xl font-bold text-white">
          {inStock}
        </div>
        <div className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-label-sm text-xs border border-emerald-500/20 font-semibold">
          High
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#475569] transition-colors">
        <div className="font-label-md text-on-surface-variant flex justify-between items-center text-xs text-slate-400">
          <span>Shelf Capacity Util</span>
          <span className="material-symbols-outlined text-[16px]">
            view_agenda
          </span>
        </div>
        <div className="font-headline-md text-on-surface text-2xl font-bold text-white">
          {shelfCapacity}
        </div>
        <div className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-label-sm text-xs border border-slate-700 font-semibold">
          Normal
        </div>
      </div>
    </div>
  );
}
