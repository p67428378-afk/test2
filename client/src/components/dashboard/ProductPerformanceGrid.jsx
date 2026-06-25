import React, { useState } from "react";

export default function ProductPerformanceGrid({
  products,
  recommendedActions,
}) {
  const [categoryFilter, setCategoryFilter] = useState("All");

  const formatAUM = (val) => {
    return `₹${(val / 10000000).toFixed(1)} Cr`;
  };

  const getStatusBadge = (status) => {
    const s = status.toUpperCase();
    if (s === "GROW") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20">
          GROW
        </span>
      );
    } else if (s === "MAINTAIN") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-secondary-fixed-dim/10 text-secondary-fixed-dim border border-secondary-fixed-dim/20">
          MAINTAIN
        </span>
      );
    } else if (s === "REDUCE") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-error/10 text-error border border-error/20">
          REDUCE
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20">
          SWAP
        </span>
      );
    }
  };

  // Get unique categories for filter
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    categoryFilter === "All"
      ? products
      : products.filter((p) => p.category === categoryFilter);

  return (
    <div className="xl:col-span-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Product Performance Matrix
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant font-medium">
            Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface-container-low border border-outline-variant rounded-md py-1 px-3 text-sm text-on-surface focus:outline-none focus:border-primary-fixed-dim"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-lowest/50">
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium">
                Product Name
              </th>
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium">
                Category
              </th>
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right">
                AUM Contribution
              </th>
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-right">
                NPA %
              </th>
              <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant font-medium text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono divide-y divide-outline-variant/50">
            {filteredProducts.map((product) => {
              // Find recommended action if active scenario overrides status
              const recAction = recommendedActions?.find(
                (a) => a.product_id === product.product_id,
              );
              const displayStatus = recAction
                ? recAction.action
                : product.status;

              return (
                <tr
                  key={product.product_id}
                  className="hover:bg-surface-container-high/50 transition-colors group"
                >
                  <td className="py-3 px-4 text-on-surface font-body-md font-medium group-hover:text-primary-fixed-dim transition-colors">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant font-body-md">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-right text-on-surface">
                    {formatAUM(product.aum_contribution)}
                  </td>
                  <td className="py-3 px-4 text-right text-on-surface-variant">
                    {product.npa_percentage.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 flex justify-center">
                    {getStatusBadge(displayStatus)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
