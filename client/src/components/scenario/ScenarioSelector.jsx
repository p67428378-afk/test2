import React from "react";

const DEFAULT_SCENARIOS = [
  {
    id: "conservative",
    label: "Conservative",
    projected_sales_delta_pct: 2.1,
    projected_pb_share_pct: 26.0,
    shelf_capacity_impact_pct: 90.0,
  },
  {
    id: "balanced",
    label: "Balanced",
    projected_sales_delta_pct: 5.2,
    projected_pb_share_pct: 28.5,
    shelf_capacity_impact_pct: 92.0,
  },
  {
    id: "aggressive",
    label: "Aggressive",
    projected_sales_delta_pct: 8.4,
    projected_pb_share_pct: 32.0,
    shelf_capacity_impact_pct: 95.0,
  },
];

export default function ScenarioSelector({
  scenariosData,
  selectedScenarioId = "balanced",
  onSelectScenario,
}) {
  const scenarioList =
    scenariosData && scenariosData.length > 0
      ? scenariosData
      : DEFAULT_SCENARIOS;

  return (
    <div className="bg-dg-slate border border-dg-slate-light rounded-xl p-density-comfortable">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-title-sm text-title-sm text-on-surface">
          Assortment Scenarios
        </h3>
        <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container px-2 py-1 rounded">
          Model: V2.4 Predictive
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-density-comfortable">
        {scenarioList.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId;

          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario && onSelectScenario(scenario)}
              className={`rounded-lg p-3 transition-all cursor-pointer relative ${
                isSelected
                  ? "border-2 border-primary-container bg-dg-navy shadow-[0_0_15px_rgba(255,194,14,0.15)]"
                  : "border border-dg-slate-light bg-dg-navy/50 hover:border-outline-variant"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2.5 -right-2.5 bg-primary-container text-dg-navy font-label-caps text-[9px] px-2 py-0.5 rounded-full font-bold shadow-md">
                  ACTIVE
                </div>
              )}
              <h4
                className={`font-data-mono text-data-mono mb-2 ${isSelected ? "text-primary-container font-bold" : "text-on-surface"}`}
              >
                {scenario.label}
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-data-mono">
                  <span className="text-on-surface-variant">Sales Delta</span>
                  <span
                    className={`text-emerald-400 ${isSelected ? "font-bold" : ""}`}
                  >
                    +{scenario.projected_sales_delta_pct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs font-data-mono">
                  <span className="text-on-surface-variant">PB Share</span>
                  <span
                    className={`text-on-surface ${isSelected ? "font-bold" : ""}`}
                  >
                    {scenario.projected_pb_share_pct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs font-data-mono">
                  <span className="text-on-surface-variant">Capacity</span>
                  <span
                    className={`text-on-surface ${isSelected ? "font-bold" : ""}`}
                  >
                    {scenario.shelf_capacity_impact_pct.toFixed(1)}%
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
