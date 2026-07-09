import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function SKUPerformanceSection({
  skus,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  selectedSkuUpc,
  onSelectSKU,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const rowRefs = useRef({});

  // Handle sort click
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Filter and sort locally as well to ensure perfect UX
  const filteredSkus = skus.filter((sku) => {
    const matchesSearch =
      !search ||
      sku.sku_name.toLowerCase().includes(search.toLowerCase()) ||
      sku.upc.includes(search);

    const matchesStatus =
      !statusFilter || sku.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const sortedSkus = [...filteredSkus].sort((a, b) => {
    if (!sortBy) return 0;
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedSkus.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSkus = sortedSkus.slice(startIndex, startIndex + itemsPerPage);

  // Scroll to selected SKU if it changes
  useEffect(() => {
    if (selectedSkuUpc) {
      // Find which page the selected SKU is on
      const index = sortedSkus.findIndex((sku) => sku.upc === selectedSkuUpc);
      if (index !== -1) {
        const page = Math.floor(index / itemsPerPage) + 1;
        if (page !== currentPage) {
          setCurrentPage(page);
        }
        // Scroll to the row element
        setTimeout(() => {
          const element = rowRefs.current[selectedSkuUpc];
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }
  }, [selectedSkuUpc, sortedSkus]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "GROW":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "MAINTAIN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SWAP":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "REDUCE":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="lg:col-span-8 bg-surface border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          Snacks SKU Performance
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">
              search
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-shadow"
              placeholder="Search SKUs or UPC..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-1.5 bg-surface border border-outline-variant rounded-lg font-label-sm text-label-sm text-secondary hover:bg-surface-container transition-colors outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="GROW">GROW</option>
              <option value="MAINTAIN">MAINTAIN</option>
              <option value="SWAP">SWAP</option>
              <option value="REDUCE">REDUCE</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-secondary text-xs pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th
                className="px-4 py-3 font-label-sm text-label-sm text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-colors"
                onClick={() => handleSort("sku_name")}
              >
                <div className="flex items-center gap-1">
                  SKU Name
                  {sortBy === "sku_name" && (
                    <span className="material-symbols-outlined text-xs">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 font-label-sm text-label-sm text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-colors"
                onClick={() => handleSort("upc")}
              >
                <div className="flex items-center gap-1">
                  UPC
                  {sortBy === "upc" && (
                    <span className="material-symbols-outlined text-xs">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 font-label-sm text-label-sm text-secondary uppercase tracking-wider text-right cursor-pointer hover:bg-surface-container-high transition-colors min-w-[120px]"
                onClick={() => handleSort("weekly_sales")}
              >
                <div className="inline-flex items-center justify-end gap-1 w-full">
                  <span>Weekly Sales</span>
                  {sortBy === "weekly_sales" && (
                    <span className="material-symbols-outlined text-xs shrink-0">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 font-label-sm text-label-sm text-secondary uppercase tracking-wider text-right cursor-pointer hover:bg-surface-container-high transition-colors min-w-[90px]"
                onClick={() => handleSort("profit_margin")}
              >
                <div className="inline-flex items-center justify-end gap-1 w-full">
                  <span>Margin</span>
                  {sortBy === "profit_margin" && (
                    <span className="material-symbols-outlined text-xs shrink-0">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 font-label-sm text-label-sm text-secondary uppercase tracking-wider text-right cursor-pointer hover:bg-surface-container-high transition-colors min-w-[120px]"
                onClick={() => handleSort("stock_level")}
              >
                <div className="inline-flex items-center justify-end gap-1 w-full">
                  <span>Stock Level</span>
                  {sortBy === "stock_level" && (
                    <span className="material-symbols-outlined text-xs shrink-0">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 font-label-sm text-label-sm text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-container-high transition-colors"
                onClick={() => handleSort("days_of_supply")}
              >
                <div className="flex items-center gap-1">
                  Days Supply
                  {sortBy === "days_of_supply" && (
                    <span className="material-symbols-outlined text-xs">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 font-label-sm text-label-sm text-secondary uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {paginatedSkus.length > 0 ? (
              paginatedSkus.map((sku) => {
                const isSelected = selectedSkuUpc === sku.upc;
                return (
                  <tr
                    key={sku.upc}
                    ref={(el) => (rowRefs.current[sku.upc] = el)}
                    onClick={() => onSelectSKU(sku)}
                    className={`hover:bg-surface-container-lowest transition-colors cursor-pointer ${
                      isSelected ? "bg-primary-fixed/30 font-semibold" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface">
                      {sku.sku_name}
                    </td>
                    <td className="px-4 py-3 font-body-sm text-body-sm text-secondary">
                      {sku.upc}
                    </td>
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface text-right">
                      $
                      {sku.weekly_sales !== undefined &&
                      sku.weekly_sales !== null
                        ? sku.weekly_sales.toLocaleString()
                        : "0"}
                    </td>
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface text-right">
                      {sku.profit_margin !== undefined &&
                      sku.profit_margin !== null
                        ? sku.profit_margin.toFixed(1)
                        : "0.0"}
                      %
                    </td>
                    <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface text-right">
                      {sku.stock_level !== undefined && sku.stock_level !== null
                        ? sku.stock_level.toLocaleString()
                        : "0"}
                    </td>
                    <td className="px-4 py-3 font-body-sm text-body-sm text-secondary">
                      {sku.days_of_supply} days
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-label-sm text-label-sm border ${getStatusBadgeClass(sku.status)}`}
                      >
                        {sku.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-secondary font-body-sm text-body-sm"
                >
                  No SKUs found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center text-secondary font-body-sm text-body-sm">
        <span>
          Showing {totalItems > 0 ? startIndex + 1 : 0}-
          {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} SKUs
        </span>
        <div className="flex gap-4">
          <button
            className="hover:text-primary transition-colors disabled:opacity-50 font-semibold"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <button
            className="hover:text-primary transition-colors disabled:opacity-50 font-semibold"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

SKUPerformanceSection.propTypes = {
  skus: PropTypes.arrayOf(
    PropTypes.shape({
      sku_name: PropTypes.string.isRequired,
      upc: PropTypes.string.isRequired,
      weekly_sales: PropTypes.number.isRequired,
      profit_margin: PropTypes.number.isRequired,
      stock_level: PropTypes.number.isRequired,
      days_of_supply: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  selectedSkuUpc: PropTypes.string,
  onSelectSKU: PropTypes.func.isRequired,
};
