import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SKUPerformanceTable({ skus = [] }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkus = skus.filter(
    (sku) =>
      sku.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getBadgeStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "GROW":
        return "text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20";
      case "MAINTAIN":
        return "text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20";
      case "SWAP":
        return "text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20";
      case "REDUCE":
        return "text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20";
      default:
        return "text-on-surface-variant bg-surface-container-high border border-outline-variant";
    }
  };

  const getIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "GROW":
        return "trending_up";
      case "MAINTAIN":
        return "horizontal_rule";
      case "SWAP":
        return "swap_horiz";
      case "REDUCE":
        return "trending_down";
      default:
        return "info";
    }
  };

  return (
    <div className="glass-panel rounded-lg flex flex-col border border-[#334155] w-full overflow-hidden">
      {/* Table Header */}
      <div className="p-4 md:p-6 border-b border-[#334155] bg-surface-container-low flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-t-lg">
        <div>
          <h2 className="text-xl font-bold text-on-surface">
            SKU Performance Table
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Current performance metrics and recommendations for Snacks SKUs.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-surface-container-low border border-outline-variant rounded px-3 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim"
          />
          <button
            onClick={() => navigate("/comparison")}
            className="px-4 py-2 bg-primary-container text-[#000000] text-sm font-bold rounded flex items-center justify-center gap-2 hover:bg-primary transition-colors active:scale-95 shadow-[0_0_15px_rgba(255,209,0,0.15)]"
          >
            <span className="material-symbols-outlined text-[18px]">
              compare
            </span>
            Compare Scenarios
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-surface-container-highest border-b border-[#334155]">
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-6">
                SKU ID
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Product Description
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Sales ($)
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Units Sold
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Margin %
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                WOS
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right pr-6">
                Fill Rate %
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">
                Recommendation
              </th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {filteredSkus.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-6 text-center text-on-surface-variant font-sans"
                >
                  No SKUs found matching your search.
                </td>
              </tr>
            ) : (
              filteredSkus.map((sku, index) => (
                <tr
                  key={sku.id || index}
                  className={`border-b border-[#334155] hover:bg-[#334155] transition-colors group ${
                    index === filteredSkus.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="p-4 pl-6 text-on-surface-variant group-hover:text-on-surface font-sans font-medium">
                    {sku.sku}
                  </td>
                  <td className="p-4 font-sans text-on-surface font-medium">
                    <div className="flex items-center gap-2">
                      {sku.product_name}
                      {sku.is_private_brand && (
                        <span className="text-[10px] bg-primary-container/10 text-primary-fixed-dim border border-primary-fixed-dim/20 px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
                          Private Brand
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right text-on-surface">
                    ${sku.sales?.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-on-surface">
                    {sku.units?.toLocaleString()}
                  </td>
                  <td
                    className={`p-4 text-right font-bold ${sku.profit_margin >= 30 ? "text-[#10B981]" : "text-on-surface"}`}
                  >
                    {sku.profit_margin}%
                  </td>
                  <td
                    className={`p-4 text-right ${sku.days_of_supply >= 30 ? "text-[#F59E0B]" : sku.days_of_supply >= 40 ? "text-[#EF4444]" : "text-on-surface"}`}
                  >
                    {sku.days_of_supply}
                  </td>
                  <td
                    className={`p-4 text-right pr-6 font-bold ${sku.vendor_fill_rate_percent >= 90 ? "text-[#10B981]" : "text-[#EF4444]"}`}
                  >
                    {sku.vendor_fill_rate_percent !== undefined
                      ? `${sku.vendor_fill_rate_percent}%`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${getBadgeStyle(sku.status_badge)}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {getIcon(sku.status_badge)}
                      </span>
                      {sku.status_badge}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
