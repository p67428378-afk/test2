import React from "react";

export default function KPIHeaderStrip({ kpis, loading, error }) {
  if (loading) {
    return (
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 animate-pulse h-28"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-lg mb-8">
        Failed to load KPIs: {error}
      </div>
    );
  }

  const data = kpis || {
    sales_per_linear_ft: 15.75,
    private_brand_percentage: 22.5,
    in_stock_rate: 98.2,
    shelf_capacity: 85.0,
  };

  return (
    <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* KPI 1 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col hover:bg-[#222a3d] transition-colors">
        <span className="text-xs text-[#bbcabf] mb-2 uppercase tracking-wider font-semibold">
          Sales per Linear Ft
        </span>
        <div className="text-3xl font-bold text-[#dae2fd] mb-2">
          $
          {typeof data.sales_per_linear_ft === "number"
            ? data.sales_per_linear_ft.toFixed(2)
            : data.sales_per_linear_ft}
        </div>
        <div className="flex items-center gap-1 text-[#10b981] text-xs font-semibold">
          <span>▲</span>
          <span>+4.2%</span>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col hover:bg-[#222a3d] transition-colors">
        <span className="text-xs text-[#bbcabf] mb-2 uppercase tracking-wider font-semibold">
          Private Brand %
        </span>
        <div className="text-3xl font-bold text-[#dae2fd] mb-2">
          {typeof data.private_brand_percentage === "number"
            ? data.private_brand_percentage.toFixed(1)
            : data.private_brand_percentage}
          %
        </div>
        <div className="flex items-center gap-1 text-[#10b981] text-xs font-semibold">
          <span>✓</span>
          <span>Target: &gt;20%</span>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col hover:bg-[#222a3d] transition-colors">
        <span className="text-xs text-[#bbcabf] mb-2 uppercase tracking-wider font-semibold">
          In-Stock Rate
        </span>
        <div className="text-3xl font-bold text-[#dae2fd] mb-2">
          {typeof data.in_stock_rate === "number"
            ? data.in_stock_rate.toFixed(1)
            : data.in_stock_rate}
          %
        </div>
        <div className="flex items-center gap-1 text-[#bbcabf] text-xs font-semibold">
          <span>▬</span>
          <span>Stable</span>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col hover:bg-[#222a3d] transition-colors">
        <span className="text-xs text-[#bbcabf] mb-2 uppercase tracking-wider font-semibold">
          Shelf Capacity
        </span>
        <div className="text-3xl font-bold text-[#dae2fd] mb-2">
          {typeof data.shelf_capacity === "number"
            ? data.shelf_capacity.toFixed(1)
            : data.shelf_capacity}
          %
        </div>
        <div className="flex items-center gap-1 text-[#ee9800] text-xs font-semibold">
          <span>⚠</span>
          <span>Limit: 90%</span>
        </div>
      </div>
    </div>
  );
}
