import React from "react";
import PropTypes from "prop-types";
import Badge from "../common/Badge";

export default function ProductPerformanceGrid({ products, selectedScenario }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-8 text-center text-on-surface-variant">
        No products available.
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col shadow-sm">
      <div className="p-5 border-b border-[#F1F5F9] bg-surface-container-lowest flex justify-between items-center">
        <h2 className="text-lg font-bold text-on-surface">
          Product Performance Grid
        </h2>
        {selectedScenario && (
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
            Showing actions for: {selectedScenario.name}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
              <th className="py-3 px-5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Product
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Category
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                AUM Contribution
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                NPA %
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Status / Action
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-on-surface font-medium">
            {products.map((product) => {
              // Find if there is a scenario-specific action for this product
              const scenarioAction = selectedScenario?.product_actions?.find(
                (pa) => pa.product_id === product.id,
              );
              const displayAction = scenarioAction
                ? scenarioAction.action
                : product.status;

              return (
                <tr
                  key={product.id}
                  className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors"
                >
                  <td className="py-3 px-5 font-semibold">{product.name}</td>
                  <td className="py-3 px-5 text-on-surface-variant">
                    {product.category}
                  </td>
                  <td className="py-3 px-5">₹{product.aum_contribution} Cr</td>
                  <td className="py-3 px-5">
                    {product.npa_percentage !== null &&
                    product.npa_percentage !== undefined ? (
                      <span
                        className={
                          product.npa_percentage > 2
                            ? "text-error font-semibold"
                            : "text-on-surface"
                        }
                      >
                        {product.npa_percentage}%
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    <Badge>{displayAction}</Badge>
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

ProductPerformanceGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      aum_contribution: PropTypes.number.isRequired,
      npa_percentage: PropTypes.number,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedScenario: PropTypes.shape({
    name: PropTypes.string.isRequired,
    product_actions: PropTypes.arrayOf(
      PropTypes.shape({
        product_id: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
      }),
    ),
  }),
};
