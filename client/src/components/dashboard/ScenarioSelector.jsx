import React from "react";

export default function ScenarioSelector({
  selectedScenario,
  onScenarioChange,
}) {
  const scenarios = [
    {
      id: "Conservative",
      name: "Conservative",
      description: "Low risk, minor tweaks to lowest performers.",
    },
    {
      id: "Balanced",
      name: "Balanced",
      description: "Moderate swaps, optimizes for margin & PB%.",
    },
    {
      id: "Aggressive",
      name: "Aggressive",
      description: "High risk, major overhaul for maximum growth.",
    },
  ];

  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg p-md">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
        {"Assortment Scenarios"}
      </h3>
      <div className="flex flex-col gap-3">
        {scenarios.map((scenario) => {
          const isSelected =
            selectedScenario?.toLowerCase() === scenario.id.toLowerCase();
          return (
            <div
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              className={`border rounded-md p-3 cursor-pointer transition-colors relative ${
                isSelected
                  ? "border-2 border-primary-container bg-surface-container-high"
                  : "border-outline-variant hover:bg-surface-container-highest"
              }`}
            >
              {isSelected && (
                <span className="material-symbols-outlined absolute top-3 right-3 text-primary-container text-[20px]">
                  {"check_circle"}
                </span>
              )}
              <div className="font-label-md text-label-md text-on-surface uppercase mb-1">
                {scenario.name}
                {isSelected && (
                  <span className="text-xs text-primary-container font-normal normal-case ml-2">
                    {"(Selected)"}
                  </span>
                )}
              </div>
              <div className="text-sm text-on-surface-variant">
                {scenario.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
