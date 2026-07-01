import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function ScenarioSelector({
  selectedScenario,
  onScenarioChange,
  projections,
}) {
  const scenarios = [
    {
      id: "conservative",
      name: "Conservative",
      description: "Focus on core SKUs. Low risk.",
    },
    {
      id: "balanced",
      name: "Balanced",
      description: "Mix of core growth and testing new items.",
    },
    {
      id: "aggressive",
      name: "Aggressive",
      description: "Maximize private label penetration. High risk.",
    },
  ];

  return (
    <div className="bg-surface border border-outline-variant rounded-xl shadow-sm p-4 flex flex-col gap-3">
      <h3 className="text-headline-sm font-bold text-on-surface mb-1">
        Scenario Selector
      </h3>

      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenario.toLowerCase() === scenario.id;

          return (
            <div
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              className={`border rounded-lg p-3 cursor-pointer transition-all relative ${
                isSelected
                  ? "border-2 border-primary-container bg-surface-bright shadow-sm"
                  : "border-outline-variant hover:bg-surface-container"
              }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`text-label-md font-bold text-on-surface ${isSelected ? "text-primary" : ""}`}
                >
                  {scenario.name}
                </div>
                {isSelected && (
                  <CheckCircle2 className="text-primary-container w-5 h-5 fill-primary-container stroke-on-primary-container" />
                )}
              </div>
              <div className="text-body-sm text-secondary mt-1">
                {scenario.description}
              </div>

              {/* Show projected impact metrics inline if selected */}
              {isSelected && projections && (
                <div className="mt-3 pt-2 border-t border-outline-variant/30 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-secondary uppercase font-semibold">
                      Sales Lift
                    </div>
                    <div className="text-body-sm font-bold text-tertiary">
                      +{projections.projected_sales_lift}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-secondary uppercase font-semibold">
                      Private Brand
                    </div>
                    <div className="text-body-sm font-bold text-on-surface">
                      {projections.projected_private_brand_pct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-secondary uppercase font-semibold">
                      Shelf Cap.
                    </div>
                    <div className="text-body-sm font-bold text-on-surface">
                      {projections.projected_shelf_capacity}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
