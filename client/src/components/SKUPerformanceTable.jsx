import React, { useState } from "react";

export default function SKUPerformanceTable({
  skus,
  loading,
  error,
  onSort,
  onFilter,
}) {
  const [filterVal, setFilterVal] = useState("");
  const [sortVal, setSortVal] = useState("");

  const handleFilterChange = (e) => {
    const val = e.target.value;
    setFilterVal(val);
    onFilter(val);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortVal(val);
    onSort(val);
  };

  if (loading) {
    return (
      <div className="xl:col-span-8 dg-card rounded-xl flex flex-col overflow-hidden p-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="xl:col-span-8 bg-error-container text-on-error-container p-6 rounded-xl border border-error">
        <p className="font-semibold">Failed to load SKU Performance</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="xl:col-span-8 dg-card rounded-xl flex flex-col overflow-hidden">
      <div className="p-4 border-b border-surface-container-highest flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low">
        <h3 className="text-headline-md font-headline-md text-on-surface">
          SKU Performance
        </h3>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-surface-container-highest px-2 py-1 rounded border border-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">
              filter_list
            </span>
            <select
              value={filterVal}
              onChange={handleFilterChange}
              className="bg-transparent border-none text-label-sm font-label-sm text-on-surface focus:ring-0 cursor-pointer"
            >
              <option value="" className="bg-slate-800">
                All Statuses
              </option>
              <option value="GROW" className="bg-slate-800">
                GROW
              </option>
              <option value="MAINTAIN" className="bg-slate-800">
                MAINTAIN
              </option>
              <option value="SWAP" className="bg-slate-800">
                SWAP
              </option>
              <option value="REDUCE" className="bg-slate-800">
                REDUCE
              </option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-highest px-2 py-1 rounded border border-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">sort</span>
            <select
              value={sortVal}
              onChange={handleSortChange}
              className="bg-transparent border-none text-label-sm font-label-sm text-on-surface focus:ring-0 cursor-pointer"
            >
              <option value="" className="bg-slate-800">
                Default Sort
              </option>
              <option value="sales_per_linear_ft" className="bg-slate-800">
                Sales (Low to High)
              </option>
              <option value="-sales_per_linear_ft" className="bg-slate-800">
                Sales (High to Low)
              </option>
              <option value="in_stock_rate" className="bg-slate-800">
                In-Stock (Low to High)
              </option>
              <option value="-in_stock_rate" className="bg-slate-800">
                In-Stock (High to Low)
              </option>
              <option value="sku" className="bg-slate-800">
                SKU Name (A-Z)
              </option>
              <option value="-sku" className="bg-slate-800">
                SKU Name (Z-A)
              </option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-lowest border-b border-surface-container-highest">
              <th className="p-3 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                SKU Name
              </th>
              <th className="p-3 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">
                Sales/Linear Ft
              </th>
              <th className="p-3 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-center">
                Private Brand
              </th>
              <th className="p-3 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">
                In-Stock %
              </th>
              <th className="p-3 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-body-md font-body-md divide-y divide-surface-container-highest">
            {skus && skus.length > 0 ? (
              skus.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-surface-variant/50 transition-colors"
                >
                  <td className="p-3 text-on-surface font-medium">
                    {item.sku}
                  </td>
                  <td className="p-3 text-data-mono font-data-mono text-right">
                    ${item.sales_per_linear_ft?.toFixed(2)}
                  </td>
                  <td className="p-3 text-center text-on-surface-variant">
                    {item.is_private_brand ? (
                      <span className="text-primary font-bold">Y</span>
                    ) : (
                      <span>N</span>
                    )}
                  </td>
                  <td className="p-3 text-data-mono font-data-mono text-right">
                    {(item.in_stock_rate * 100)?.toFixed(1)}%
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "GROW"
                          ? "bg-secondary/15 text-secondary"
                          : item.status === "MAINTAIN"
                            ? "bg-blue-500/15 text-blue-400"
                            : item.status === "SWAP"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-error/15 text-error"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-on-surface-variant"
                >
                  No SKUs found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
