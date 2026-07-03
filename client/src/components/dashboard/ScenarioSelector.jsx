import React from "react";

export default function ScenarioSelector({
  selectedScenario,
  onSelectScenario,
}) {
  const scenarios = [
    {
      name: "Conservative",
      sales: "+1%",
      pb: "+0.5%",
    },
    {
      name: "Balanced",
      sales: "+3%",
      pb: "+1.5%",
    },
    {
      name: "Aggressive",
      sales: "+6%",
      pb: "+2.0%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-3">
      {scenarios.map((sc) => {
        const isSelected =
          selectedScenario?.toLowerCase() === sc.name.toLowerCase();
        return (
          <div
            key={sc.name}
            onClick={() => onSelectScenario(sc.name)}
            className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition-all duration-200 relative ${
              isSelected
                ? "border-2 border-primary shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                : "border border-slate-700 hover:border-slate-500"
            }`}
          >
            {isSelected && (
              <span
                className="material-symbols-outlined absolute top-2 right-2 text-primary text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            )}
            <div className="font-semibold text-white mb-2 pr-6">
              {sc.name} {sc.name === "Balanced" && "(Default)"}
            </div>
            <div className="text-sm text-slate-400 flex justify-between">
              <span>Sales:</span>{" "}
              <span className="text-emerald-400 font-bold">{sc.sales}</span>
            </div>
            <div className="text-sm text-slate-400 flex justify-between">
              <span>PB %:</span>{" "}
              <span className="text-emerald-400 font-bold">{sc.pb}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
