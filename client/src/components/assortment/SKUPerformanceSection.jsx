import React, { useState } from "react";

export default function SKUPerformanceSection({
  skus,
  loading,
  error,
  onSearch,
  onSort,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleSort = (field) => {
    const order = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(order);
    if (onSort) {
      onSort(field, order);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "GROW") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wide border border-emerald-500/30">
          Grow
        </span>
      );
    } else if (s === "MAINTAIN") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 uppercase tracking-wide border border-blue-500/30">
          Maintain
        </span>
      );
    } else if (s === "SWAP") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase tracking-wide border border-amber-500/30">
          Swap
        </span>
      );
    } else if (s === "REDUCE") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 uppercase tracking-wide border border-rose-500/30">
          Reduce
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-400 uppercase tracking-wide border border-slate-500/30">
        {status}
      </span>
    );
  };

  // Local filtering/sorting as fallback if parent doesn't handle it
  const filteredSkus = skus
    ? skus.filter(
        (sku) =>
          sku.sku_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sku.upc.includes(searchTerm),
      )
    : [];

  const sortedSkus = sortBy
    ? [...filteredSkus].sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        if (typeof aVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      })
    : filteredSkus;

  return (
    <div className="surface-l1 rounded-xl flex flex-col h-full overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-[#334155] flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-white">SKU Performance</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              search
            </span>
            <input
              className="dark-input w-full pl-9 pr-3 py-1.5 rounded-lg text-xs text-white placeholder-slate-500"
              placeholder="Search SKUs..."
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleSort("sku_name")}
              className={`dark-input px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors ${sortBy === "sku_name" ? "border-emerald-500 text-white" : ""}`}
            >
              <span className="material-symbols-outlined text-sm">sort</span>
              Name {sortBy === "sku_name" && (sortOrder === "asc" ? "▲" : "▼")}
            </button>
            <button
              onClick={() => handleSort("weekly_sales")}
              className={`dark-input px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors ${sortBy === "weekly_sales" ? "border-emerald-500 text-white" : ""}`}
            >
              <span className="material-symbols-outlined text-sm">
                trending_up
              </span>
              Sales{" "}
              {sortBy === "weekly_sales" && (sortOrder === "asc" ? "▲" : "▼")}
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto max-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-slate-400">
            Loading SKU performance data...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            Failed to load SKU data.
          </div>
        ) : sortedSkus.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No SKUs found matching search criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#1E293B] z-10 border-b border-[#334155]">
              <tr>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-2 px-4 whitespace-nowrap">
                  SKU Name
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-2 px-4 whitespace-nowrap">
                  UPC
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-2 px-4 whitespace-nowrap">
                  Sales Rank
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-2 px-4 whitespace-nowrap text-right">
                  Weekly Sales
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-2 px-4 whitespace-nowrap text-right">
                  Margin %
                </th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-2 px-4 whitespace-nowrap text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {sortedSkus.map((sku) => (
                <tr
                  key={sku.id}
                  className="data-table-row hover:bg-slate-800/50 transition-colors group h-10"
                >
                  <td className="py-2 px-4 font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      <span>{sku.sku_name}</span>
                      {sku.is_private_brand && (
                        <span
                          className="material-symbols-outlined text-[14px] text-emerald-500"
                          title="Private Brand"
                        >
                          local_offer
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 font-mono text-slate-400">
                    {sku.upc}
                  </td>
                  <td className="py-2 px-4 text-slate-300">
                    {sku.sales_rank_percentile
                      ? `${sku.sales_rank_percentile}th`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 text-right font-mono text-slate-200">
                    $
                    {typeof sku.weekly_sales === "number"
                      ? sku.weekly_sales.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : sku.weekly_sales}
                  </td>
                  <td className="py-2 px-4 text-right font-mono text-slate-300">
                    {typeof sku.margin_percentage === "number"
                      ? `${sku.margin_percentage.toFixed(1)}%`
                      : sku.margin_percentage}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {getStatusBadge(sku.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
