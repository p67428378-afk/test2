import React from "react";
import PropTypes from "prop-types";

export default function ProductPerformanceTable({ products, loading }) {
  if (loading) {
    return (
      <div className="bg-card border border-subtle rounded-xl overflow-hidden flex flex-col">
        <div className="p-card-padding border-b border-subtle flex justify-between items-center">
          <h2 className="font-title-md text-title-md text-[#F8FAFC]">
            Retail Product Portfolio Performance
          </h2>
        </div>
        <div className="p-8 text-center text-muted animate-pulse">
          Loading product portfolio...
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === "GROW") {
      return (
        <span className="bg-[#059669]/10 text-[#34D399] font-label-sm text-label-sm px-2 py-1 rounded border border-[#059669]/30">
          GROW
        </span>
      );
    } else if (s === "MAINTAIN") {
      return (
        <span className="bg-[#3B82F6]/10 text-[#60A5FA] font-label-sm text-label-sm px-2 py-1 rounded border border-[#3B82F6]/30">
          MAINTAIN
        </span>
      );
    } else if (s === "REDUCE") {
      return (
        <span className="bg-[#DC2626]/10 text-[#F87171] font-label-sm text-label-sm px-2 py-1 rounded border border-[#DC2626]/30">
          REDUCE
        </span>
      );
    } else if (s === "SWAP") {
      return (
        <span className="bg-[#D97706]/10 text-[#FBBF24] font-label-sm text-label-sm px-2 py-1 rounded border border-[#D97706]/30">
          SWAP
        </span>
      );
    }
    return (
      <span className="bg-slate-700 text-slate-300 font-label-sm text-label-sm px-2 py-1 rounded border border-slate-600">
        {status}
      </span>
    );
  };

  return (
    <div className="bg-card border border-subtle rounded-xl overflow-hidden flex flex-col">
      <div className="p-card-padding border-b border-subtle flex justify-between items-center">
        <h2 className="font-title-md text-title-md text-[#F8FAFC]">
          Retail Product Portfolio Performance
        </h2>
        <button className="text-muted hover:text-[#F8FAFC] transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A]/50 border-b border-subtle text-muted font-label-md text-label-md uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Product Name</th>
              <th className="py-3 px-4 font-semibold">AUM Contribution</th>
              <th className="py-3 px-4 font-semibold">NPA %</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-[#F8FAFC] divide-y divide-subtle">
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-[#334155]/30 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 font-mono-data text-mono-data">
                    ₹{product.aum_contribution} Cr
                  </td>
                  <td
                    className={`py-3 px-4 font-mono-data text-mono-data ${product.npa_percentage > 1.5 ? "text-[#F87171]" : ""}`}
                  >
                    {product.npa_percentage}%
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(product.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-muted">
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
