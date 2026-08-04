import React from "react";
import { useAssortment } from "../../context/AssortmentContext.jsx";

export default function ScenarioSelector() {
  const { scenariosData, selectedScenarioName, handleSelectScenario } =
    useAssortment();

  const scenariosList = scenariosData?.scenarios || [
    {
      scenario_id: "SCEN-01",
      name: "Conservative",
      subtitle: "Focus on core SKUs, minimize space changes.",
      projected_sales_lift_pct: 1.2,
      projected_private_brand_pct: 27.2,
      shelf_capacity_impact_pct: 91.5,
      action_summary: { GROW: 2, MAINTAIN: 12, SWAP: 1, REDUCE: 2 },
    },
    {
      scenario_id: "SCEN-02",
      name: "Balanced",
      subtitle: "Optimize Private Brand mix while protecting top NBs.",
      projected_sales_lift_pct: 3.5,
      projected_private_brand_pct: 28.5,
      shelf_capacity_impact_pct: 94.0,
      action_summary: { GROW: 4, MAINTAIN: 85, SWAP: 3, REDUCE: 2 },
    },
    {
      scenario_id: "SCEN-03",
      name: "Aggressive",
      subtitle: "Max Private Brand penetration, high churn.",
      projected_sales_lift_pct: 4.1,
      projected_private_brand_pct: 31.0,
      shelf_capacity_impact_pct: 98.2,
      action_summary: { GROW: 24, MAINTAIN: 8, SWAP: 4, REDUCE: 2 },
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-500">
          model_training
        </span>
        Assortment Scenarios
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenariosList.map((scenario) => {
          const name = scenario.name || scenario.scenario_name;
          const isSelected = selectedScenarioName === name;
          const isAggressive = name === "Aggressive";
          const isBalanced = name === "Balanced";

          const lift =
            scenario.projected_sales_lift_pct !== undefined
              ? scenario.projected_sales_lift_pct
              : 3.5;
          const pbPct =
            scenario.projected_private_brand_pct !== undefined
              ? scenario.projected_private_brand_pct
              : scenario.private_brand_mix_pct || 28.5;
          const churn = isAggressive ? "15%" : isBalanced ? "8%" : "2%";

          return (
            <div
              key={scenario.scenario_id || name}
              onClick={() => handleSelectScenario(name)}
              className={`bg-[#1E293B] rounded-lg p-5 border cursor-pointer relative transition-all ${
                isSelected
                  ? "border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  : "border-[#334155] hover:bg-[#334155]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[36px] border-l-[36px] border-t-amber-500 border-l-transparent">
                  <span className="material-symbols-outlined absolute -top-8 -right-8 text-slate-950 text-xs font-bold">
                    check
                  </span>
                </div>
              )}

              <h4
                className={`text-xl font-semibold mb-1 ${isSelected ? "text-amber-500" : "text-white"}`}
              >
                {name}
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                {scenario.subtitle ||
                  (isBalanced
                    ? "Optimize Private Brand mix while protecting top NBs."
                    : isAggressive
                      ? "Max Private Brand penetration, high churn."
                      : "Focus on core SKUs, minimize space changes.")}
              </p>

              <div className="space-y-2 border-t border-[#334155] pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Proj. Sales Lift</span>
                  <span
                    className={`font-mono font-semibold ${lift >= 3 ? "text-emerald-400" : "text-white"}`}
                  >
                    +{lift}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Proj. PB Mix</span>
                  <span className="font-mono text-white font-semibold">
                    {pbPct}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SKU Churn</span>
                  <span
                    className={`font-mono font-semibold ${isAggressive ? "text-rose-400" : "text-white"}`}
                  >
                    {churn}
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
