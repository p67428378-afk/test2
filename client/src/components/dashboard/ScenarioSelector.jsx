import React from "react";
import { CheckCircle2 } from "lucide-react";

const scenarios = [
  {
    id: "Conservative",
    name: "Conservative",
    description: "Minimal space changes, focus on core.",
  },
  {
    id: "Balanced",
    name: "Balanced",
    description: "Optimize private brand, swap low performers.",
  },
  {
    id: "Aggressive",
    name: "Aggressive",
    description: "Max private brand intro, major re-flow.",
  },
];

export default function ScenarioSelector({
  selectedScenario,
  onSelectScenario,
}) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
      <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-xs font-semibold">
        Scenario Modeling
      </h3>
      {scenarios.map((scenario) => {
        const isSelected = selectedScenario === scenario.id;
        return (
          <div
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className={`border rounded p-sm cursor-pointer transition-all flex justify-between items-center ${
              isSelected
                ? "border-2 border-primary bg-primary/10"
                : "border-outline-variant bg-[#1E293B] hover:border-surface-variant opacity-70 hover:opacity-100"
            }`}
          >
            <div>
              <p
                className={`font-body-md text-body-md font-medium ${isSelected ? "text-primary" : "text-on-surface"}`}
              >
                {scenario.name}
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                {scenario.description}
              </p>
            </div>
            {isSelected ? (
              <CheckCircle2 className="text-primary h-5 w-5" />
            ) : (
              <div className="w-4 h-4 rounded border border-outline-variant"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
