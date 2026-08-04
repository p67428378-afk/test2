import React from "react";
import { useAssortment } from "../context/AssortmentContext";

const ScenarioSelector = () => {
  const {
    scenarios,
    selectedScenarioName,
    setSelectedScenarioName,
    scenariosLoading,
  } = useAssortment();

  const getScenarioSubtitle = (name) => {
    if (name?.toLowerCase().includes("conservative"))
      return "Low risk, stable shelf space";
    if (name?.toLowerCase().includes("balanced"))
      return "Optimal sales mix & PB growth";
    if (name?.toLowerCase().includes("aggressive"))
      return "Max sales lift, high velocity shift";
    return "Targeted category strategy";
  };

  if (scenariosLoading) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-[#dae2fd]">
          Assortment Recommendation Scenarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 h-40"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-[#dae2fd]">
          Assortment Recommendation Scenarios
        </h2>
        <span className="text-xs text-[#d8c3ad]">
          Balanced is pre-selected default
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const isSelected = scenario.name === selectedScenarioName;
          const actions = scenario.action_summary || {
            GROW: 0,
            MAINTAIN: 0,
            REDUCE: 0,
            SWAP: 0,
          };

          return (
            <div
              key={scenario.scenario_id || scenario.name}
              onClick={() => setSelectedScenarioName(scenario.name)}
              className={`rounded-lg p-4 cursor-pointer transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? "bg-[#1E293B] border-2 border-[#F59E0B] bg-[#F59E0B]/5 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  : "bg-[#1E293B] border-[#334155] hover:bg-[#222a3d] hover:border-[#475569]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-[#F59E0B] text-[#0F172A] rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
              )}

              <div>
                <div className="mb-3 pr-6">
                  <h3
                    className={`text-base font-bold ${isSelected ? "text-[#F59E0B]" : "text-[#dae2fd]"}`}
                  >
                    {scenario.name}
                  </h3>
                  <p className="text-xs text-[#d8c3ad]">
                    {getScenarioSubtitle(scenario.name)}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#d8c3ad]">Projected Sales Lift</span>
                    <span className="font-mono font-bold text-[#10B981]">
                      +
                      {Number(scenario.projected_sales_lift_pct || 0).toFixed(
                        1,
                      )}
                      %
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#d8c3ad]">Private Brand Mix</span>
                    <span className="font-mono font-bold text-[#dae2fd]">
                      {Number(
                        scenario.projected_private_brand_pct || 0,
                      ).toFixed(1)}
                      %
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#d8c3ad]">
                      Shelf Capacity Impact
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        Number(scenario.shelf_capacity_impact_pct) > 95
                          ? "text-[#F43F5E]"
                          : "text-[#10B981]"
                      }`}
                    >
                      {Number(
                        scenario.shelf_capacity_impact_pct || 94.0,
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Action summary pill row */}
              <div className="mt-4 pt-3 border-t border-[#334155] flex justify-between text-[10px] font-semibold">
                <span className="text-[#10B981]">{actions.GROW || 0} GROW</span>
                <span className="text-[#6366F1]">
                  {actions.MAINTAIN || 0} MAINTAIN
                </span>
                <span className="text-[#F59E0B]">{actions.SWAP || 0} SWAP</span>
                <span className="text-[#F43F5E]">
                  {actions.REDUCE || 0} REDUCE
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioSelector;
