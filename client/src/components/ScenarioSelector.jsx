import React from "react";

export default function ScenarioSelector({
  scenarios,
  selectedScenarioId,
  onScenarioSelect,
}) {
  return (
    <div className="lg:col-span-2 card-bg border border-outline-variant rounded-lg p-5 flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          Scenario Selector
        </h2>
        <button className="text-primary font-label-md text-label-md flex items-center hover:underline">
          <span className="material-symbols-outlined text-[16px] mr-1">
            add
          </span>{" "}
          Custom Scenario
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {scenarios.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId;
          return (
            <label
              key={scenario.id}
              className="relative cursor-pointer h-full group"
            >
              <input
                type="radio"
                name="scenario"
                value={scenario.id}
                checked={isSelected}
                onChange={() => onScenarioSelect(scenario.id)}
                className="peer sr-only"
              />
              <div
                className={`border rounded-lg p-4 h-full flex flex-col hover:bg-surface-container-high/50 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-primary ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "border-outline-variant"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`font-body-md text-body-md text-on-surface ${isSelected ? "font-bold" : "font-medium"}`}
                  >
                    {scenario.name}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-emerald-500"
                        : "border-outline-variant"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                  {scenario.description}
                </p>
                <div className="mt-auto space-y-2">
                  <div className="flex justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Proj. Sales</span>
                    <span className="text-on-surface font-medium text-primary-container">
                      +{scenario.projected_sales_pct?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">PB %</span>
                    <span className="text-on-surface font-medium">
                      {scenario.private_brand_pct?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Swaps</span>
                    <span className="text-on-surface font-medium">
                      {scenario.swaps_count}
                    </span>
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
