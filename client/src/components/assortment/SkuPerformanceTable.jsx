import React, { useState } from "react";
import PropTypes from "prop-types";

export default function SkuPerformanceTable({ skus }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredSkus = skus.filter((sku) => {
    const matchesSearch =
      sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || sku.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "GROW":
        return "bg-[#22c55e]/10 text-[#4ade80] border border-[#22c55e]/30";
      case "MAINTAIN":
        return "bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/30";
      case "SWAP":
        return "bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/30";
      case "REDUCE":
        return "bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/30";
      default:
        return "bg-surface-container-high text-on-surface-variant border border-outline-variant";
    }
  };

  return (
    <div className="col-span-12 xl:col-span-8 bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
      <div className="p-lg border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface-container-low">
        <div>
          <h2 className="font-headline-md text-headline-md text-white mb-xs">
            SKU Performance
          </h2>
          <p className="text-on-surface-variant font-body-md text-body-md">
            Real-time performance metrics for Small Town Value Cluster.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <input
              type="text"
              placeholder="Search SKU or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-md py-sm bg-surface-container-high border border-outline rounded text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary-container text-body-md"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-md py-sm rounded border border-outline text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-sm h-full"
            >
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
              <span>Filter: {statusFilter}</span>
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-xs w-48 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-20 py-1">
                {["ALL", "GROW", "MAINTAIN", "SWAP", "REDUCE"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-md py-sm text-body-md hover:bg-surface-container-highest transition-colors ${
                      statusFilter === status
                        ? "text-primary-container font-bold"
                        : "text-on-surface"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high sticky top-0 z-10">
            <tr>
              <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                SKU ID / Name
              </th>
              <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                PB
              </th>
              <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                In-Stock
              </th>
              <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Facings
              </th>
              <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Recommendation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredSkus.length > 0 ? (
              filteredSkus.map((sku) => (
                <tr
                  key={sku.id}
                  className="hover:bg-surface-container-high transition-colors"
                >
                  <td className="px-lg py-md">
                    <div className="flex flex-col">
                      <span className="text-primary-container font-mono text-[12px]">
                        #{sku.sku}
                      </span>
                      <span className="text-on-surface font-semibold">
                        {sku.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-lg py-md text-on-surface">
                    ${sku.sales_per_linear_ft.toFixed(2)}
                  </td>
                  <td className="px-lg py-md text-on-surface-variant">
                    {sku.private_brand_percent > 0 ? (
                      <span className="text-primary-container font-semibold">
                        Yes
                      </span>
                    ) : (
                      "No"
                    )}
                  </td>
                  <td className="px-lg py-md text-on-surface">
                    {sku.in_stock_rate.toFixed(1)}%
                  </td>
                  <td className="px-lg py-md text-on-surface">
                    {sku.shelf_capacity}"
                  </td>
                  <td className="px-lg py-md">
                    <span
                      className={`px-md py-xs rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(sku.status)}`}
                    >
                      {sku.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-lg py-xl text-center text-on-surface-variant"
                >
                  No SKUs match the search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto p-lg bg-surface-container-high flex items-center justify-between">
        <span className="text-on-surface-variant text-label-md">
          Showing {filteredSkus.length} of {skus.length} SKUs in category
        </span>
        <div className="flex gap-xs">
          <button className="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

SkuPerformanceTable.propTypes = {
  skus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      sku: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      private_brand_percent: PropTypes.number.isRequired,
      sales_per_linear_ft: PropTypes.number.isRequired,
      in_stock_rate: PropTypes.number.isRequired,
      shelf_capacity: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
