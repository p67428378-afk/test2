import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react";

export default function SKUPerformanceTable({
  skus,
  loading,
  currentScenario,
  onActionChange,
}) {
  const getBadgeColor = (action) => {
    switch (action) {
      case "GROW":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "MAINTAIN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "SWAP":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "REDUCE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getBadgeIcon = (action) => {
    switch (action) {
      case "GROW":
        return <ArrowUpRight className="w-3.5 h-3.5 mr-1" />;
      case "MAINTAIN":
        return <Check className="w-3.5 h-3.5 mr-1" />;
      case "SWAP":
        return <RefreshCw className="w-3.5 h-3.5 mr-1" />;
      case "REDUCE":
        return <ArrowDownRight className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-on-surface">
            Snacks SKU Performance
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Review performance metrics and customize actions for the Small Town
            Value Cluster.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20">
          <span className="text-xs font-medium text-on-surface-variant">
            Active Scenario:
          </span>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {currentScenario}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                SKU Info
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Brand Type
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Sales
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Units
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Margin %
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">
                Scenario Action
              </th>
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">
                Override Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-4">
                    <div className="h-4 bg-surface-container-highest rounded w-32"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-surface-container-highest rounded w-16"></div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="h-4 bg-surface-container-highest rounded w-12 ml-auto"></div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="h-4 bg-surface-container-highest rounded w-10 ml-auto"></div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="h-4 bg-surface-container-highest rounded w-12 ml-auto"></div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="h-6 bg-surface-container-highest rounded w-20 mx-auto"></div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="h-8 bg-surface-container-highest rounded w-24 mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : skus.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-8 text-center text-sm text-on-surface-variant"
                >
                  No SKUs found.
                </td>
              </tr>
            ) : (
              skus.map((sku) => {
                const scenarioAction =
                  sku.scenarios?.[currentScenario]?.action || "MAINTAIN";
                const currentAction = sku.currentAction || scenarioAction;

                return (
                  <tr
                    key={sku.sku_id}
                    className="hover:bg-surface-container-low/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-on-surface">
                          {sku.product_name}
                        </span>
                        <span className="text-xs text-on-surface-variant/80 mt-0.5">
                          #{sku.sku_number}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {sku.is_private_brand ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                          Private Brand
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-surface-variant text-on-surface-variant border border-outline-variant/20 uppercase tracking-wider">
                          National Brand
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-on-surface text-right">
                      {formatCurrency(sku.sales)}
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant text-right">
                      {sku.units.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant text-right">
                      {sku.margin_percentage.toFixed(1)}%
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeColor(scenarioAction)}`}
                      >
                        {getBadgeIcon(scenarioAction)}
                        {scenarioAction}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={currentAction}
                        onChange={(e) =>
                          onActionChange(sku.sku_id, e.target.value)
                        }
                        className="text-xs font-semibold bg-white border border-outline-variant rounded-lg px-2.5 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer outline-none"
                      >
                        <option value="GROW">GROW</option>
                        <option value="MAINTAIN">MAINTAIN</option>
                        <option value="SWAP">SWAP</option>
                        <option value="REDUCE">REDUCE</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
