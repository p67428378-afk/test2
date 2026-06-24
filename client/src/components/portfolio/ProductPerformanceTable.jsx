import React from "react";
import PropTypes from "prop-types";

export default function ProductPerformanceTable({ products, loading }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "GROW":
        return (
          <span className="inline-flex px-2 py-1 rounded bg-emerald-status-light text-emerald-status font-label-mono text-[10px] font-bold">
            GROW
          </span>
        );
      case "REDUCE":
        return (
          <span className="inline-flex px-2 py-1 rounded bg-rose-status-light text-rose-status font-label-mono text-[10px] font-bold">
            REDUCE
          </span>
        );
      case "SWAP":
        return (
          <span className="inline-flex px-2 py-1 rounded bg-amber-status-light text-amber-status font-label-mono text-[10px] font-bold">
            SWAP
          </span>
        );
      case "MAINTAIN":
      default:
        return (
          <span className="inline-flex px-2 py-1 rounded bg-surface-bright text-on-surface-variant font-label-mono text-[10px] border border-outline-variant font-bold">
            MAINTAIN
          </span>
        );
    }
  };

  const getCategory = (name) => {
    if (
      name.includes("Savings") ||
      name.includes("RD") ||
      name.includes("FD")
    ) {
      return "Liability";
    }
    if (name.includes("PL") || name.includes("Gold")) {
      return "Asset";
    }
    return "Third-Party";
  };

  return (
    <div className="card-surface rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container">
        <h3 className="font-headline-sm text-on-surface text-lg font-bold">
          Product Performance
        </h3>
        <div className="flex gap-2">
          <button
            className="p-1 text-slate-muted hover:text-on-surface transition-colors"
            aria-label="Filter list"
          >
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
          </button>
          <button
            className="p-1 text-slate-muted hover:text-on-surface transition-colors"
            aria-label="More options"
          >
            <span className="material-symbols-outlined text-[20px]">
              more_vert
            </span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left font-body-sm">
          <thead className="bg-[#0F172A] border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 font-label-mono text-slate-muted text-xs font-semibold">
                Product Name
              </th>
              <th className="px-4 py-3 font-label-mono text-slate-muted text-xs font-semibold">
                Category
              </th>
              <th className="px-4 py-3 font-label-mono text-slate-muted text-xs font-semibold text-right">
                AUM Contribution
              </th>
              <th className="px-4 py-3 font-label-mono text-slate-muted text-xs font-semibold text-right">
                NPA %
              </th>
              <th className="px-4 py-3 font-label-mono text-slate-muted text-xs font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <tr
                  key={i}
                  className="animate-pulse"
                  data-testid="product-row-loading"
                >
                  <td className="px-4 py-4">
                    <div className="h-4 bg-surface-container-highest rounded w-3/4"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-surface-container-highest rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-surface-container-highest rounded w-1/3 ml-auto"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-surface-container-highest rounded w-1/4 ml-auto"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 bg-surface-container-highest rounded w-16"></div>
                  </td>
                </tr>
              ))
            ) : products && products.length > 0 ? (
              products.map((product, idx) => (
                <tr
                  key={product.id}
                  className={`hover:bg-surface-container-high transition-colors group ${
                    idx % 2 === 1 ? "bg-surface-container-lowest/50" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-on-surface">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-slate-muted">
                    {getCategory(product.name)}
                  </td>
                  <td className="px-4 py-3 font-label-mono text-right text-on-surface">
                    ₹{product.aum_contribution} Cr
                  </td>
                  <td className="px-4 py-3 font-label-mono text-right">
                    {product.npa_percentage > 0 ? (
                      <span className="text-rose-status">
                        {product.npa_percentage}%
                      </span>
                    ) : (
                      <span className="text-slate-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(product.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-slate-muted"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ProductPerformanceTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      aum_contribution: PropTypes.number.isRequired,
      npa_percentage: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ),
  loading: PropTypes.bool,
};
