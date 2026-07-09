import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus, RefreshCw } from "lucide-react";
import Badge from "../common/Badge.jsx";

export default function SKUPerformanceSection({
  items,
  loading,
  onRefresh,
  total,
  page,
  limit,
  onPageChange,
}) {
  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case "GROW":
        return "success";
      case "MAINTAIN":
        return "info";
      case "OPTIMIZE":
        return "warning";
      case "REMOVE":
        return "danger";
      default:
        return "neutral";
    }
  };

  const renderTrendIcon = (trend) => {
    switch (trend?.toUpperCase()) {
      case "UP":
        return (
          <span
            className="inline-flex items-center text-green-600 ml-1.5"
            title="Trend: Up"
          >
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
          </span>
        );
      case "DOWN":
        return (
          <span
            className="inline-flex items-center text-red-600 ml-1.5"
            title="Trend: Down"
          >
            <ArrowDownRight className="h-4 w-4 stroke-[2.5]" />
          </span>
        );
      case "FLAT":
      default:
        return (
          <span
            className="inline-flex items-center text-gray-400 ml-1.5"
            title="Trend: Flat"
          >
            <Minus className="h-4 w-4 stroke-[2.5]" />
          </span>
        );
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            SKU Performance & Seasonal Trends
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Snacks SKUs for Small Town Value Cluster
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          title="Refresh SKU Data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3 text-right">Weekly Sales</th>
              <th className="px-6 py-3 text-right">Profit Margin</th>
              <th className="px-6 py-3 text-right">Days of Supply</th>
              <th className="px-6 py-3 text-center">Status & Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-dg-black" />
                    <span>Loading SKU performance data...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No SKU performance data available.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.sku}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-900">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    ${item.sales?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.profit_margin}%
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.days_of_supply}d
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <Badge
                        text={item.status_badge}
                        variant={getStatusVariant(item.status_badge)}
                      />
                      {renderTrendIcon(item.trend_direction)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 text-xs font-semibold text-gray-500">
          <span>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total} SKUs
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || loading}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || loading}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
