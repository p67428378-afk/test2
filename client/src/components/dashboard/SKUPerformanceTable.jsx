import React, { useState } from "react";

export default function SKUPerformanceTable({
  skus,
  onSearch,
  onSort,
  sortBy,
  sortOrder,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const renderSortIcon = (col) => {
    if (sortBy !== col)
      return (
        <span className="material-symbols-outlined text-xs text-slate-500 ml-1">
          unfold_more
        </span>
      );
    return sortOrder === "asc" ? (
      <span className="material-symbols-outlined text-xs text-primary ml-1">
        arrow_upward
      </span>
    ) : (
      <span className="material-symbols-outlined text-xs text-primary ml-1">
        arrow_downward
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "GROW":
        return (
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded font-bold border border-emerald-500/30">
            GROW
          </span>
        );
      case "REDUCE":
        return (
          <span className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs rounded font-bold border border-rose-500/30">
            REDUCE
          </span>
        );
      case "MAINTAIN":
        return (
          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded font-bold border border-blue-500/30">
            MAINTAIN
          </span>
        );
      case "SWAP":
        return (
          <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded font-bold border border-amber-500/30">
            SWAP
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-500/10 text-slate-400 text-xs rounded font-bold border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="col-span-12 lg:col-span-8 bg-slate-800 border border-slate-700 rounded-lg flex flex-col">
      <div className="p-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-headline-md text-headline-md text-white text-xl font-bold">
          SKU Performance Table
        </h2>
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search SKUs or products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
          />
          <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 text-sm">
            search
          </span>
        </div>
      </div>
      <div className="overflow-x-auto p-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="font-label-caps text-label-caps text-slate-400 border-b border-slate-700 text-xs uppercase tracking-wider">
              <th
                onClick={() => onSort("sku_id")}
                className="p-4 font-medium cursor-pointer hover:text-white transition-colors select-none"
              >
                <div className="flex items-center">
                  SKU # {renderSortIcon("sku_id")}
                </div>
              </th>
              <th
                onClick={() => onSort("product_name")}
                className="p-4 font-medium cursor-pointer hover:text-white transition-colors select-none"
              >
                <div className="flex items-center">
                  Product Name {renderSortIcon("product_name")}
                </div>
              </th>
              <th
                onClick={() => onSort("current_sales")}
                className="p-4 font-medium text-right cursor-pointer hover:text-white transition-colors select-none"
              >
                <div className="flex items-center justify-end">
                  Current Sales {renderSortIcon("current_sales")}
                </div>
              </th>
              <th
                onClick={() => onSort("sales_growth")}
                className="p-4 font-medium text-right cursor-pointer hover:text-white transition-colors select-none"
              >
                <div className="flex items-center justify-end">
                  Sales Growth (YoY) {renderSortIcon("sales_growth")}
                </div>
              </th>
              <th
                onClick={() => onSort("is_private_brand")}
                className="p-4 font-medium text-center cursor-pointer hover:text-white transition-colors select-none"
              >
                <div className="flex items-center justify-center">
                  Private Brand {renderSortIcon("is_private_brand")}
                </div>
              </th>
              <th
                onClick={() => onSort("status")}
                className="p-4 font-medium cursor-pointer hover:text-white transition-colors select-none"
              >
                <div className="flex items-center">
                  Status {renderSortIcon("status")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono text-sm">
            {skus.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  No SKUs found matching the criteria.
                </td>
              </tr>
            ) : (
              skus.map((sku) => (
                <tr
                  key={sku.sku_id}
                  className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4 text-slate-300">{sku.sku_id}</td>
                  <td className="p-4 text-white font-body-sm font-medium">
                    {sku.product_name}
                  </td>
                  <td className="p-4 text-right text-white">
                    ${sku.current_sales?.toLocaleString()}
                  </td>
                  <td
                    className={`p-4 text-right font-bold ${sku.sales_growth >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {sku.sales_growth >= 0
                      ? `+${sku.sales_growth}%`
                      : `${sku.sales_growth}%`}
                  </td>
                  <td className="p-4 text-center font-bold">
                    {sku.is_private_brand ? (
                      <span className="text-emerald-400">Y</span>
                    ) : (
                      <span className="text-slate-500">N</span>
                    )}
                  </td>
                  <td className="p-4">{getStatusBadge(sku.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
