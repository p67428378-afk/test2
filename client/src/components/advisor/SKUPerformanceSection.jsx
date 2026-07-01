import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "../common/Badge.jsx";

export default function SKUPerformanceSection({
  items = [],
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onSearchChange,
  onStatusChange,
  loading,
  error,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Debounce search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    onStatusChange(status);
    setShowFilterMenu(false);
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatPercent = (val) => {
    if (val === undefined || val === null) return "0.0%";
    return `${val.toFixed(1)}%`;
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return "0";
    return new Intl.NumberFormat("en-US").format(val);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="lg:col-span-8 bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest">
        <h2 className="text-headline-sm font-bold text-on-surface">
          Snacks SKU Performance
        </h2>

        <div className="flex gap-2 w-full sm:w-auto relative">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-shadow"
              placeholder="Search SKUs or UPC..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-3 py-1.5 border border-outline-variant rounded-lg flex items-center gap-2 text-secondary hover:bg-surface-container transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-label-sm font-semibold">
                {selectedStatus || "Status"}
              </span>
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-surface border border-outline-variant rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={() => handleStatusSelect("")}
                  className="w-full text-left px-4 py-2 text-body-sm hover:bg-surface-container transition-colors"
                >
                  All Statuses
                </button>
                {["GROW", "MAINTAIN", "SWAP", "REDUCE"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    className="w-full text-left px-4 py-2 text-body-sm hover:bg-surface-container transition-colors"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        {loading ? (
          <div className="p-8 text-center text-secondary">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            Loading SKU performance data...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error-container bg-error-container/10 m-4 rounded-lg border border-error-container/20">
            Failed to load SKU performance data.
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-secondary">
            No SKUs found matching the criteria.
          </div>
        ) : (
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-4 py-3 text-label-sm text-secondary uppercase tracking-wider font-semibold">
                  SKU Name
                </th>
                <th className="px-4 py-3 text-label-sm text-secondary uppercase tracking-wider font-semibold">
                  UPC
                </th>
                <th className="px-4 py-3 text-label-sm text-secondary uppercase tracking-wider font-semibold text-right">
                  Weekly Sales
                </th>
                <th className="px-4 py-3 text-label-sm text-secondary uppercase tracking-wider font-semibold text-right">
                  Margin
                </th>
                <th className="px-4 py-3 text-label-sm text-secondary uppercase tracking-wider font-semibold text-right">
                  Stock Level
                </th>
                <th className="px-4 py-3 text-label-sm text-secondary uppercase tracking-wider font-semibold">
                  Days Supply
                </th>
                <th className="px-4 py-3 text-label-sm text-secondary uppercase tracking-wider font-semibold text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container-lowest transition-colors"
                >
                  <td className="px-4 py-3 text-body-sm text-on-surface font-medium">
                    {item.sku_name}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-secondary font-mono">
                    {item.upc}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-on-surface text-right font-semibold">
                    {formatCurrency(item.weekly_sales)}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-on-surface text-right">
                    {formatPercent(item.profit_margin)}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-on-surface text-right">
                    {formatNumber(item.stock_level)}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-secondary">
                    {item.days_of_supply} days
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center text-secondary text-body-sm mt-auto">
        <span>
          Showing {items.length > 0 ? (page - 1) * limit + 1 : 0}-
          {Math.min(page * limit, total)} of {total} SKUs
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="p-1.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="p-1.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
