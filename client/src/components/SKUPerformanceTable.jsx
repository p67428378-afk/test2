import React, { useState, useMemo } from "react";

export default function SKUPerformanceTable({ skus }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterFilterText] = useState("");

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredSKUs = useMemo(() => {
    if (!skus) return [];
    return skus.filter(
      (sku) =>
        sku.name.toLowerCase().includes(filterText.toLowerCase()) ||
        sku.sku_id.toLowerCase().includes(filterText.toLowerCase()),
    );
  }, [skus, filterText]);

  const sortedSKUs = useMemo(() => {
    const sortableItems = [...filteredSKUs];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredSKUs, sortConfig]);

  const getBadgeClass = (recommendation) => {
    switch (recommendation?.toUpperCase()) {
      case "GROW":
        return "bg-semantic-success-light text-semantic-success border-[#10B981]";
      case "SWAP":
        return "bg-semantic-warning-light text-semantic-warning border-[#F59E0B]";
      case "REDUCE":
        return "bg-semantic-danger-light text-semantic-danger border-[#EF4444]";
      default:
        return "bg-[#334155] text-[#CBD5E1] border-[#475569]";
    }
  };

  return (
    <div className="w-[65%] bg-surface-card border border-subtle rounded flex flex-col overflow-hidden">
      <div className="px-md py-sm border-b border-subtle bg-[#1E293B] flex items-center justify-between gap-md">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Snacks SKU Performance &amp; Recommendations
        </h2>
        <input
          type="text"
          placeholder="Filter by SKU Name or ID..."
          value={filterText}
          onChange={(e) => setFilterFilterText(e.target.value)}
          className="bg-[#0F172A] border border-subtle text-on-surface text-body-sm rounded px-sm py-1 focus:outline-none focus:border-primary-container w-64"
        />
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#1E293B] border-b border-subtle z-10">
            <tr>
              <th
                className="font-label-caps text-label-caps text-[#94A3B8] p-sm font-normal cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                SKU Name &amp; ID{" "}
                {sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                className="font-label-caps text-label-caps text-[#94A3B8] p-sm font-normal text-right cursor-pointer select-none"
                onClick={() => handleSort("current_sales")}
              >
                Current Sales{" "}
                {sortConfig.key === "current_sales"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                className="font-label-caps text-label-caps text-[#94A3B8] p-sm font-normal text-right cursor-pointer select-none"
                onClick={() => handleSort("sales_trend_yoy")}
              >
                Sales Trend (YoY){" "}
                {sortConfig.key === "sales_trend_yoy"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                className="font-label-caps text-label-caps text-[#94A3B8] p-sm font-normal text-right cursor-pointer select-none"
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
                className="font-label-caps text-label-caps text-[#94A3B8] p-sm font-normal text-right cursor-pointer select-none"
                onClick={() => handleSort("in_stock_rate")}
              >
                In-Stock Rate{" "}
                {sortConfig.key === "in_stock_rate"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                className="font-label-caps text-label-caps text-[#94A3B8] p-sm font-normal text-center cursor-pointer select-none"
                onClick={() => handleSort("recommendation")}
              >
                Recommendation{" "}
                {sortConfig.key === "recommendation"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono divide-y divide-[#334155]">
            {sortedSKUs.map((sku) => (
              <tr
                key={sku.sku_id}
                className="table-row-hover transition-colors"
              >
                <td className="p-sm text-on-surface">
                  <div className="font-body-sm">{sku.name}</div>
                  <div className="text-on-surface-variant text-[11px]">
                    {sku.sku_id}
                  </div>
                </td>
                <td className="p-sm text-right">
                  ${sku.current_sales.toLocaleString()}
                </td>
                <td
                  className={`p-sm text-right ${sku.sales_trend_yoy >= 0 ? "text-semantic-success" : "text-semantic-danger"}`}
                >
                  {sku.sales_trend_yoy >= 0 ? "+" : ""}
                  {sku.sales_trend_yoy}%
                </td>
                <td className="p-sm text-right">{sku.profit_margin}%</td>
                <td className="p-sm text-right">{sku.in_stock_rate}%</td>
                <td className="p-sm text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded border font-label-caps text-[10px] ${getBadgeClass(sku.recommendation)}`}
                  >
                    {sku.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
