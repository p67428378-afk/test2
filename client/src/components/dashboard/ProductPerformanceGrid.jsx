import React from "react";
import Badge from "../common/Badge";

export default function ProductPerformanceGrid({ products, selectedScenario }) {
  // Map product actions from selected scenario for quick lookup
  const actionMap = React.useMemo(() => {
    const map = {};
    if (selectedScenario?.product_actions) {
      selectedScenario.product_actions.forEach((pa) => {
        map[pa.product_id] = pa.action;
      });
    }
    return map;
  }, [selectedScenario]);

  return (
    <div className="col-span-12 xl:col-span-8 bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex flex-col">
      <div className="p-5 border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
        <h3 className="font-title-sm text-title-sm font-semibold text-on-surface">
          Product Performance
        </h3>
        <button
          className="text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Filter list"
        >
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Product
              </th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Category
              </th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                Volume
              </th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                NPA / Risk
              </th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                Action Strategy
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md divide-y divide-outline-variant/50">
            {products.map((product) => {
              // Determine action strategy based on selected scenario or default product status
              const action = actionMap[product.id] || product.status;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-surface-container-high transition-colors group"
                >
                  <td className="p-4 font-medium text-on-surface">
                    {product.name}
                  </td>
                  <td className="p-4 text-secondary">{product.category}</td>
                  <td className="p-4 text-right font-data-mono text-data-mono">
                    ₹{product.aum_contribution} Cr
                  </td>
                  <td
                    className={`p-4 text-right font-data-mono text-data-mono ${product.npa_percentage > 3 ? "text-error" : product.npa_percentage > 0 ? "text-tertiary" : "text-secondary"}`}
                  >
                    {product.npa_percentage !== null &&
                    product.npa_percentage !== undefined
                      ? `${product.npa_percentage}%`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-right">
                    <Badge status={action} />
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
