import React from "react";

export default function ScenarioSelector({
  selectedScenario,
  onScenarioChange,
}) {
  const scenarios = [
    {
      id: "Conservative",
      name: "Conservative",
      description: "Minimal disruption to current planogram.",
    },
    {
      id: "Balanced",
      name: "Balanced",
      description: "Optimizes for profit while maintaining brand variety.",
    },
    {
      id: "Aggressive",
      name: "Aggressive",
      description: "Maximum private brand penetration.",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-[#dae2fd]">Scenario Selector</h3>
      {scenarios.map((scenario) => {
        const isSelected = selectedScenario === scenario.id;
        return (
          <button
            key={scenario.id}
            onClick={() => onScenarioChange(scenario.id)}
            className={`w-full text-left bg-[#1E293B] rounded-lg p-4 transition-all relative border ${
              isSelected
                ? "border-2 border-[#10b981] bg-[#10b981]/5"
                : "border-[#334155] hover:bg-[#222a3d]"
            }`}
          >
            {isSelected && (
              <span className="absolute top-4 right-4 text-[#10b981] font-bold">
                ✓
              </span>
            )}
            <div
              className={`text-lg font-bold ${isSelected ? "text-[#10b981]" : "text-[#dae2fd]"}`}
            >
              {scenario.name}
            </div>
            <div className="text-sm text-[#bbcabf] mt-1">
              {scenario.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
