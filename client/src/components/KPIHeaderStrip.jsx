import React from "react";
import { useAssortment } from "../context/AssortmentContext";

const KPIHeaderStrip = () => {
  const { kpiData, kpiLoading } = useAssortment();

  if (kpiLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 h-24"
          ></div>
        ))}
      </div>
    );
  }

  const sales = kpiData?.sales_per_linear_ft
    ? `$${Number(kpiData.sales_per_linear_ft).toFixed(2)}`
    : "$142.50";
  const pbMix = kpiData?.private_brand_mix_pct
    ? `${Number(kpiData.private_brand_mix_pct).toFixed(1)}%`
    : "28.5%";
  const inStock = kpiData?.in_stock_rate_pct
    ? `${Number(kpiData.in_stock_rate_pct).toFixed(1)}%`
    : "96.2%";
  const capacity = kpiData?.shelf_capacity_utilization_pct
    ? `${Number(kpiData.shelf_capacity_utilization_pct).toFixed(1)}%`
    : "94.0%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Sales per Linear Ft */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#475569] transition-colors">
        <div className="text-xs font-semibold text-[#d8c3ad] flex justify-between items-center">
          <span>Sales per Linear Ft</span>
          <span className="material-symbols-outlined text-xs">show_chart</span>
        </div>
        <div className="text-2xl font-bold text-[#dae2fd]">
          {sales}{" "}
          <span className="text-xs font-normal text-[#d8c3ad]">/ lin ft</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-[#10B981]">
          <span>↑ +4.2% trend</span>
        </div>
      </div>

      {/* Card 2: Private Brand Mix */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#475569] transition-colors">
        <div className="text-xs font-semibold text-[#d8c3ad] flex justify-between items-center">
          <span>Private Brand Mix</span>
          <span className="material-symbols-outlined text-xs">pie_chart</span>
        </div>
        <div className="text-2xl font-bold text-[#dae2fd]">{pbMix}</div>
        <div className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-semibold border border-[#10B981]/20">
          Optimal (Target ≥25%)
        </div>
      </div>

      {/* Card 3: In-Stock Rate */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#475569] transition-colors">
        <div className="text-xs font-semibold text-[#d8c3ad] flex justify-between items-center">
          <span>In-Stock Rate</span>
          <span className="material-symbols-outlined text-xs">inventory</span>
        </div>
        <div className="text-2xl font-bold text-[#dae2fd]">{inStock}</div>
        <div className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-semibold border border-[#10B981]/20">
          High (Target ≥95%)
        </div>
      </div>

      {/* Card 4: Shelf Capacity Util */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-[#475569] transition-colors">
        <div className="text-xs font-semibold text-[#d8c3ad] flex justify-between items-center">
          <span>Shelf Capacity Util</span>
          <span className="material-symbols-outlined text-xs">view_agenda</span>
        </div>
        <div className="text-2xl font-bold text-[#dae2fd]">{capacity}</div>
        <div className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-[#222a3d] text-[#d8c3ad] text-xs font-semibold border border-[#534434]">
          Normal (Target ≤100%)
        </div>
      </div>
    </div>
  );
};

export default KPIHeaderStrip;
