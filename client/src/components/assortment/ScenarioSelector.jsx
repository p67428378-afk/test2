import React from "react";

export default function ScenarioSelector({
  selectedScenario,
  onSelectScenario,
  metrics,
}) {
  // Calculate projected metrics for each scenario based on the original metrics
  // Conservative: reduces sales slightly, increases margin, keeps private brand stable
  // Balanced: moderate growth, balanced private brand
  // Aggressive: high growth, high private brand push
  const scenarios = [
    {
      id: "Conservative",
      title: "Conservative Plan",
      desc: "Focus on risk mitigation and shelf space optimization.",
      projectedSales: metrics ? metrics.sales_per_linear_ft * 0.92 : 0,
      projectedPB: metrics
        ? Math.min(100, metrics.private_brand_percentage * 1.05)
        : 0,
      risk: "Low Risk",
      riskColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "Balanced",
      title: "Balanced Plan",
      desc: "Optimized mix of sales growth and private brand expansion.",
      projectedSales: metrics ? metrics.sales_per_linear_ft * 1.04 : 0,
      projectedPB: metrics
        ? Math.min(100, metrics.private_brand_percentage * 1.12)
        : 0,
      risk: "Moderate Risk",
      riskColor: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "Aggressive",
      title: "Aggressive Plan",
      desc: "Maximize sales volume and aggressive private brand conversion.",
      projectedSales: metrics ? metrics.sales_per_linear_ft * 1.15 : 0,
      projectedPB: metrics
        ? Math.min(100, metrics.private_brand_percentage * 1.25)
        : 0,
      risk: "High Risk",
      riskColor: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-on-surface">
          Assortment Scenarios
        </h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Select a scenario strategy to simulate projected impacts on sales and
          private brand share.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scen) => {
          const isSelected = selectedScenario === scen.id;
          return (
            <div
              key={scen.id}
              onClick={() => onSelectScenario(scen.id)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-full ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/10"
                  : "border-outline-variant/30 bg-white hover:border-outline hover:shadow-sm"
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-base text-on-surface">
                    {scen.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${scen.riskColor}`}
                  >
                    {scen.risk}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  {scen.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20 grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                    Proj. Sales/Ft
                  </span>
                  <span className="text-sm font-bold text-on-surface mt-0.5">
                    {formatCurrency(scen.projectedSales)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                    Proj. PB Share
                  </span>
                  <span className="text-sm font-bold text-on-surface mt-0.5">
                    {scen.projectedPB.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
