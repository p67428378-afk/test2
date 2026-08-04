import React from "react";
import { useAssortment } from "../context/AssortmentContext.jsx";

export default function ScenarioSelector() {
  const { scenariosData, selectedScenarioName, handleSelectScenario } =
    useAssortment();

  const scenariosList = scenariosData?.scenarios || [];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-title-lg text-on-surface text-lg font-bold text-white">
        Assortment Recommendation Scenarios
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenariosList.map((scenario) => {
          const isSelected = selectedScenarioName === scenario.name;
          const isAggressive = scenario.name === "Aggressive";
          const isBalanced = scenario.name === "Balanced";

          return (
            <div
              key={scenario.scenario_id || scenario.name}
              onClick={() => handleSelectScenario(scenario.name)}
              className={`rounded-lg p-4 cursor-pointer transition-all relative ${
                isSelected
                  ? "bg-[#1E293B] border-2 border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                  : "bg-[#1E293B] border border-[#334155] hover:bg-slate-800"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-amber-500 rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#0F172A] text-[14px] font-bold">
                    check
                  </span>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3
                    className={`font-title-lg text-base font-bold mb-1 ${
                      isSelected ? "text-amber-500" : "text-white"
                    }`}
                  >
                    {scenario.name}
                  </h3>
                  <p className="font-body-sm text-slate-400 text-xs">
                    {scenario.subtitle ||
                      (isBalanced
                        ? "Optimal mix & stability"
                        : isAggressive
                          ? "Max sales lift, higher risk"
                          : "Low risk, minimal space changes")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-body-sm text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Projected Lift</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    +{scenario.projected_sales_lift_pct}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">PB Mix</span>
                  <span className="font-mono text-white font-semibold">
                    {scenario.projected_private_brand_pct}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity Impact</span>
                  <span
                    className={`font-mono font-semibold ${
                      isAggressive
                        ? "text-rose-400"
                        : isBalanced
                          ? "text-slate-200"
                          : "text-emerald-400"
                    }`}
                  >
                    {scenario.shelf_capacity_impact_pct > 95
                      ? "+4 Lin Ft"
                      : isBalanced
                        ? "Neutral"
                        : "-2 Lin Ft"}
                  </span>
                </div>

                {scenario.action_summary && (
                  <div className="pt-3 border-t border-[#334155] flex justify-between text-[10px] font-semibold">
                    {scenario.action_summary.GROW !== undefined && (
                      <span className="text-emerald-400">
                        {scenario.action_summary.GROW} GROW
                      </span>
                    )}
                    {scenario.action_summary.MAINTAIN !== undefined && (
                      <span className="text-indigo-400">
                        {scenario.action_summary.MAINTAIN} MAINTAIN
                      </span>
                    )}
                    {scenario.action_summary.SWAP !== undefined && (
                      <span className="text-amber-400">
                        {scenario.action_summary.SWAP} SWAP
                      </span>
                    )}
                    {scenario.action_summary.REDUCE !== undefined && (
                      <span className="text-rose-400">
                        {scenario.action_summary.REDUCE} REDUCE
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
