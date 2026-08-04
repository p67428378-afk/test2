import React from "react";
import { useAssortment } from "../context/AssortmentContext.jsx";

export default function SKUPerformanceTable() {
  const {
    filteredSkus,
    selectedSubCategory,
    setSelectedSubCategory,
    searchQuery,
    setSearchQuery,
    selectedStatusBadge,
    setSelectedStatusBadge,
  } = useAssortment();

  const renderBadge = (badge) => {
    switch (badge) {
      case "GROW":
        return (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-label-sm border border-emerald-500/30 text-xs font-semibold w-24">
            GROW
          </span>
        );
      case "MAINTAIN":
        return (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-label-sm border border-indigo-500/30 text-xs font-semibold w-24">
            MAINTAIN
          </span>
        );
      case "SWAP":
        return (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-label-sm border border-amber-500/30 text-xs font-semibold w-24">
            SWAP
          </span>
        );
      case "REDUCE":
        return (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-label-sm border border-rose-500/30 text-xs font-semibold w-24">
            REDUCE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-label-sm text-xs font-semibold w-24">
            {badge || "UNKNOWN"}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg flex flex-col overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-[#334155] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-title-lg text-on-surface text-lg font-bold text-white">
            Snacks Category SKU Performance
          </h2>
          <div className="flex gap-2 mt-2">
            {["", "GROW", "MAINTAIN", "SWAP", "REDUCE"].map((badge) => (
              <button
                key={badge || "ALL"}
                onClick={() => setSelectedStatusBadge(badge)}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${
                  selectedStatusBadge === badge
                    ? "bg-amber-500 text-slate-900 font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {badge || "All Badges"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              className="w-full bg-[#0F172A] border border-[#334155] rounded pl-9 pr-3 py-1.5 text-xs text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors outline-none placeholder:text-slate-500"
              placeholder="Filter SKUs..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="bg-[#0F172A] border border-[#334155] rounded px-3 py-1.5 text-xs text-white focus:border-amber-500 outline-none appearance-none pr-8 cursor-pointer"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
          >
            <option value="All Sub-Categories">All Sub-Categories</option>
            <option value="Salty Snacks">Salty Snacks</option>
            <option value="Trail Mix">Trail Mix</option>
            <option value="Cookies">Cookies</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full data-table text-left border-collapse">
          <thead class="bg-[#0F172A]">
            <tr>
              <th className="font-label-sm text-[#94A3B8] border-b border-[#334155] text-xs font-semibold py-2 px-4 w-24">
                SKU ID
              </th>
              <th className="font-label-sm text-[#94A3B8] border-b border-[#334155] text-xs font-semibold py-2 px-4">
                Product Description
              </th>
              <th className="font-label-sm text-[#94A3B8] border-b border-[#334155] text-xs font-semibold py-2 px-4">
                Brand
              </th>
              <th className="font-label-sm text-[#94A3B8] border-b border-[#334155] text-xs font-semibold py-2 px-4 text-right">
                Vel (U/W)
              </th>
              <th className="font-label-sm text-[#94A3B8] border-b border-[#334155] text-xs font-semibold py-2 px-4 text-right">
                Margin
              </th>
              <th className="font-label-sm text-[#94A3B8] border-b border-[#334155] text-xs font-semibold py-2 px-4 text-center">
                Rec Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155] font-body-sm text-sm">
            {filteredSkus.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-slate-400 text-xs"
                >
                  No SKUs match the current filters.
                </td>
              </tr>
            ) : (
              filteredSkus.map((sku) => (
                <tr
                  key={sku.sku_id || sku.sku_code}
                  className={`hover:bg-[#2D3748] transition-colors ${
                    sku.status_badge === "SWAP" ? "bg-amber-500/5" : ""
                  }`}
                >
                  <td className="font-mono text-[#94A3B8] text-xs py-2 px-4">
                    {sku.sku_code || sku.sku_id}
                  </td>
                  <td className="text-white font-medium py-2 px-4">
                    {sku.product_name}
                  </td>
                  <td className="py-2 px-4">
                    {sku.is_private_brand || sku.brand === "DG Brand" ? (
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                        DG Brand
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">
                        {sku.brand || "National"}
                      </span>
                    )}
                  </td>
                  <td className="font-mono text-right text-slate-200 text-xs py-2 px-4">
                    {sku.sales_volume_weekly}
                  </td>
                  <td className="font-mono text-right text-slate-200 text-xs py-2 px-4">
                    {sku.margin_pct}%
                  </td>
                  <td className="text-center py-2 px-4">
                    {renderBadge(sku.status_badge)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
