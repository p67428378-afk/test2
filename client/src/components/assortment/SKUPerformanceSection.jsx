import React, { useState } from "react";

export default function SKUPerformanceSection({
  skus,
  loading,
  error,
  onFilterChange,
  currentFilter,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSkus = React.useMemo(() => {
    if (!skus) return [];
    let sortableItems = [...skus];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [skus, sortConfig]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "GROW":
        return "bg-[#10b981]/20 text-[#4edea3]";
      case "MAINTAIN":
        return "bg-[#71a1ff]/20 text-[#adc6ff]";
      case "SWAP":
        return "bg-[#ee9800]/20 text-[#ffb95f]";
      case "REDUCE":
        return "bg-[#93000a]/20 text-[#ffb4ab]";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg flex flex-col overflow-hidden h-full">
      {/* Header & Filters */}
      <div className="p-5 border-b border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-[#dae2fd]">SKU Performance</h3>
        <div className="flex bg-[#171f33] rounded border border-[#334155] p-1 overflow-x-auto max-w-full">
          {["All", "GROW", "MAINTAIN", "SWAP", "REDUCE"].map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter === "All" ? "" : filter)}
              className={`px-3 py-1 rounded-sm text-xs font-semibold transition-colors whitespace-nowrap ${
                (filter === "All" && !currentFilter) || currentFilter === filter
                  ? "bg-[#222a3d] text-[#dae2fd]"
                  : "text-[#bbcabf] hover:text-[#dae2fd]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-[#bbcabf] animate-pulse">
            Loading SKU performance data...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            Failed to load SKUs: {error}
          </div>
        ) : sortedSkus.length === 0 ? (
          <div className="p-8 text-center text-[#bbcabf]">
            No SKUs found matching the filter.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-[#bbcabf] uppercase tracking-wider border-b border-[#334155] bg-[#171f33]">
                <th
                  className="p-4 font-semibold cursor-pointer select-none hover:text-[#dae2fd]"
                  onClick={() => handleSort("name")}
                >
                  SKU Name{" "}
                  {sortConfig.key === "name"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer select-none hover:text-[#dae2fd]"
                  onClick={() => handleSort("sales")}
                >
                  Sales{" "}
                  {sortConfig.key === "sales"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer select-none hover:text-[#dae2fd]"
                  onClick={() => handleSort("profit_margin")}
                >
                  Profit Margin{" "}
                  {sortConfig.key === "profit_margin"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer select-none hover:text-[#dae2fd]"
                  onClick={() => handleSort("units_sold")}
                >
                  Units Sold{" "}
                  {sortConfig.key === "units_sold"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer select-none hover:text-[#dae2fd]"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#dae2fd] divide-y divide-[#334155]">
              {sortedSkus.map((sku) => (
                <tr
                  key={sku.id}
                  className="hover:bg-[#222a3d] transition-colors"
                >
                  <td className="p-4 font-medium">{sku.name}</td>
                  <td className="p-4">
                    $
                    {typeof sku.sales === "number"
                      ? sku.sales.toLocaleString()
                      : sku.sales}
                  </td>
                  <td className="p-4">
                    {typeof sku.profit_margin === "number"
                      ? sku.profit_margin.toFixed(1)
                      : sku.profit_margin}
                    %
                  </td>
                  <td className="p-4">
                    {typeof sku.units_sold === "number"
                      ? sku.units_sold.toLocaleString()
                      : sku.units_sold}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(sku.status)}`}
                    >
                      {sku.status}
                    </span>
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
