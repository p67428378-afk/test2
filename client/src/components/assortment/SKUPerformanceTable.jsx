import React from "react";
import { useAssortment } from "../../context/AssortmentContext.jsx";

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
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-xs font-semibold w-24">
            GROW
          </span>
        );
      case "MAINTAIN":
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-400/10 text-slate-300 border border-slate-400/20 text-xs font-semibold w-24">
            MAINTAIN
          </span>
        );
      case "SWAP":
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-semibold w-24">
            SWAP
          </span>
        );
      case "REDUCE":
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-rose-400/10 text-rose-400 border border-rose-400/20 text-xs font-semibold w-24">
            REDUCE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold w-24">
            {badge || "UNKNOWN"}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-[#334155] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">
            view_list
          </span>
          SKU Performance & Recommendations
        </h3>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Badge Filters */}
          <div className="flex gap-1.5 overflow-x-auto">
            {["", "GROW", "MAINTAIN", "SWAP", "REDUCE"].map((badge) => (
              <button
                key={badge || "ALL"}
                onClick={() => setSelectedStatusBadge(badge)}
                className={`text-xs px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  selectedStatusBadge === badge
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-[#0F172A] text-slate-400 border border-[#334155] hover:text-white"
                }`}
              >
                {badge || "All Badges"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              className="w-full bg-[#0F172A] border border-[#334155] rounded py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              placeholder="Search SKU ID or Name..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-[#0F172A] border border-[#334155] rounded py-1.5 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="All Sub-Categories">All Sub-categories</option>
              <option value="Salty Snacks">Salty Snacks</option>
              <option value="Sweet Snacks">Sweet Snacks</option>
              <option value="Trail Mix">Trail Mix</option>
              <option value="Jerky & Meat">Jerky & Meat</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1E293B] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-[#334155]">
              <th className="p-3 pl-4">SKU ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Sales / Wk</th>
              <th className="p-3 text-right">Margin</th>
              <th className="p-3 text-right">Shelf Spc</th>
              <th className="p-3 text-center">PB</th>
              <th className="p-3 text-center pr-4">Rec Status</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-200 divide-y divide-[#334155]">
            {filteredSkus.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400">
                  No SKUs match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredSkus.map((sku) => {
                const skuCode = sku.sku_code || sku.sku_id;
                const salesVal =
                  sku.sales_volume_weekly || sku.sales_volume || 0;
                const isPB =
                  sku.is_private_brand || sku.private_brand_indicator;

                return (
                  <tr
                    key={skuCode}
                    className="hover:bg-[#334155] transition-colors"
                  >
                    <td className="p-3 pl-4 font-mono font-medium text-slate-300">
                      {skuCode}
                    </td>
                    <td className="p-3 font-medium text-white">
                      {sku.product_name}
                    </td>
                    <td className="p-3 text-slate-400">
                      {sku.sub_category || "Salty Snacks"}
                    </td>
                    <td className="p-3 text-right font-mono">
                      $
                      {Number(salesVal).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`p-3 text-right font-mono ${sku.margin_pct >= 35 ? "text-emerald-400" : sku.margin_pct < 20 ? "text-rose-400" : "text-white"}`}
                    >
                      {sku.margin_pct}%
                    </td>
                    <td className="p-3 text-right font-mono">
                      {sku.linear_space_ft
                        ? `${sku.linear_space_ft} Ft`
                        : "2 Facings"}
                    </td>
                    <td className="p-3 text-center">
                      {isPB ? (
                        <span className="material-symbols-outlined text-amber-500 text-base">
                          check_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-slate-500 text-base">
                          close
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center pr-4">
                      {renderBadge(sku.status_badge)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
