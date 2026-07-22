import React from "react";

export default function ScenarioSelectorSection({
  selectedScenario,
  onSelectScenario,
  projections,
}) {
  const scenarios = [
    {
      id: "conservative",
      name: "Conservative",
      estSales: "-1.2%",
      pb: "17.5%",
    },
    {
      id: "balanced",
      name: "Balanced",
      estSales: "+2.4%",
      pb: "19.5%",
    },
    {
      id: "aggressive",
      name: "Aggressive",
      estSales: "+5.1%",
      pb: "22.0%",
    },
  ];

  // If we have real projections from the API, we can display them dynamically
  const getEstSales = (id) => {
    if (projections && projections[id]) {
      const sales = projections[id].projected_total_sales;
      // Format or compare with baseline
      return `$${sales.toLocaleString()}`;
    }
    if (id === "conservative") return "Est Sales: -1.2%";
    if (id === "balanced") return "Est Sales: +2.4%";
    return "Est Sales: +5.1%";
  };

  const getPB = (id) => {
    if (projections && projections[id]) {
      return `PB%: ${projections[id].projected_private_brand_percentage.toFixed(1)}%`;
    }
    if (id === "conservative") return "PB%: 17.5%";
    if (id === "balanced") return "PB%: 19.5%";
    return "PB%: 22.0%";
  };

  return (
    <div className="surface-l1 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-[#334155] pb-3">
        <span className="material-symbols-outlined text-slate-400">
          model_training
        </span>
        <h2 className="text-lg font-semibold text-white">Scenario Modeling</h2>
      </div>
      <div className="flex flex-col gap-3">
        {scenarios.map((sc) => {
          const isActive = selectedScenario === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`bg-slate-800 rounded-lg p-3 cursor-pointer transition-all relative ${
                isActive
                  ? "scenario-card-active shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "scenario-card-inactive hover:bg-slate-700"
              }`}
            >
              {isActive && (
                <div className="absolute top-2 right-2">
                  <span className="material-symbols-outlined text-[#10B981] text-sm font-bold">
                    check_circle
                  </span>
                </div>
              )}
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-sm font-semibold ${isActive ? "text-white font-bold" : "text-slate-300"}`}
                >
                  {sc.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span
                  className={`font-mono ${isActive ? "text-emerald-400" : "text-slate-400"}`}
                >
                  {getEstSales(sc.id)}
                </span>
                <span className="font-mono text-slate-400">{getPB(sc.id)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
