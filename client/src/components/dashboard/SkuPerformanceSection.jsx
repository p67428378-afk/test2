import React, { useState } from "react";

export default function SkuPerformanceSection({
  skus,
  loading,
  onSearchChange,
  onSortChange,
  sortBy,
  sortOrder,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    onSearchChange("");
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    onSortChange(column, isAsc ? "desc" : "asc");
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "GROW":
        return "bg-[#10B981]/20 text-[#10B981]";
      case "MAINTAIN":
        return "bg-[#3B82F6]/20 text-[#3B82F6]";
      case "REDUCE":
        return "bg-[#EF4444]/20 text-[#EF4444]";
      case "SWAP":
        return "bg-[#F59E0B]/20 text-[#F59E0B]";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) {
      return (
        <span className="material-symbols-outlined text-[14px] ml-1 opacity-30">
          {"unfold_more"}
        </span>
      );
    }
    return sortOrder === "asc" ? (
      <span className="material-symbols-outlined text-[14px] ml-1 text-primary-container">
        {"arrow_upward"}
      </span>
    ) : (
      <span className="material-symbols-outlined text-[14px] ml-1 text-primary-container">
        {"arrow_downward"}
      </span>
    );
  };

  return (
    <div className="col-span-1 md:col-span-8 bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden">
      <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          {"Snacks SKU Performance"}
        </h2>
        <div className="flex gap-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
          >
            <span className="material-symbols-outlined absolute left-2 text-on-surface-variant text-[20px]">
              {"search"}
            </span>
            <input
              type="text"
              className="bg-surface border border-outline-variant rounded-md pl-8 pr-8 py-1.5 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container w-48"
              placeholder="Search SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {"close"}
                </span>
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant animate-pulse">
            {"Loading SKU performance data..."}
          </div>
        ) : skus.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">
            {"No SKUs found matching the criteria."}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface text-on-surface-variant font-label-md text-label-md uppercase border-b border-outline-variant">
              <tr>
                <th
                  className="py-3 px-4 font-semibold tracking-wider cursor-pointer hover:text-on-surface select-none"
                  onClick={() => handleSort("product_name")}
                >
                  <div className="flex items-center">
                    {"Product Name"}
                    {renderSortIcon("product_name")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 font-semibold tracking-wider cursor-pointer hover:text-on-surface select-none"
                  onClick={() => handleSort("sku_code")}
                >
                  <div className="flex items-center">
                    {"SKU"}
                    {renderSortIcon("sku_code")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 font-semibold tracking-wider text-right cursor-pointer hover:text-on-surface select-none"
                  onClick={() => handleSort("sales_revenue")}
                >
                  <div className="flex items-center justify-end">
                    {"Sales Rev"}
                    {renderSortIcon("sales_revenue")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 font-semibold tracking-wider text-right cursor-pointer hover:text-on-surface select-none"
                  onClick={() => handleSort("units_sold")}
                >
                  <div className="flex items-center justify-end">
                    {"Units"}
                    {renderSortIcon("units_sold")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 font-semibold tracking-wider text-right cursor-pointer hover:text-on-surface select-none"
                  onClick={() => handleSort("profit_margin")}
                >
                  <div className="flex items-center justify-end">
                    {"Margin"}
                    {renderSortIcon("profit_margin")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 font-semibold tracking-wider text-right cursor-pointer hover:text-on-surface select-none"
                  onClick={() => handleSort("days_of_supply")}
                >
                  <div className="flex items-center justify-end">
                    {"DOS"}
                    {renderSortIcon("days_of_supply")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 font-semibold tracking-wider text-center cursor-pointer hover:text-on-surface select-none"
                  onClick={() => handleSort("status_badge")}
                >
                  <div className="flex items-center justify-center">
                    {"Status"}
                    {renderSortIcon("status_badge")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono text-on-surface divide-y divide-outline-variant">
              {skus.map((sku, index) => (
                <tr
                  key={sku.id}
                  className={`${index % 2 === 1 ? "bg-surface-container-high" : ""} hover:bg-surface-container-highest transition-colors`}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    {sku.product_name}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    {sku.sku_code}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {"$"}
                    {sku.sales_revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {sku.units_sold.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {sku.profit_margin}
                    {"%"}
                  </td>
                  <td className="py-3 px-4 text-right">{sku.days_of_supply}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(sku.status_badge)}`}
                    >
                      {sku.status_badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 border-t border-outline-variant bg-surface-container-high flex justify-between items-center">
        <span className="text-sm text-on-surface-variant">
          {"Showing "}
          {skus.length}
          {" of "}
          {skus.length}
          {" SKUs"}
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border border-outline-variant rounded text-sm text-on-surface-variant opacity-50 cursor-not-allowed"
            disabled
          >
            {"Prev"}
          </button>
          <button
            className="px-3 py-1 border border-outline-variant rounded text-sm text-on-surface-variant opacity-50 cursor-not-allowed"
            disabled
          >
            {"Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
