import React from "react";

export default function ScenarioSelectorPanel({
  selectedScenario,
  onSelectScenario,
  scenarioData,
}) {
  const scenarios = [
    {
      id: "conservative",
      name: "Conservative",
      desc: "Focus on asset quality, low risk",
      projections: {
        casa_growth: 1.2,
        npa_risk_movement: -0.8,
        roa_impact: 0.05,
      },
    },
    {
      id: "balanced",
      name: "Balanced",
      desc: "Moderate growth, deposit focus",
      projections: {
        casa_growth: 2.5,
        npa_risk_movement: -0.4,
        roa_impact: 0.15,
      },
    },
    {
      id: "aggressive",
      name: "Aggressive",
      desc: "High yield, rapid credit expansion",
      projections: {
        casa_growth: 4.8,
        npa_risk_movement: 0.6,
        roa_impact: 0.35,
      },
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
        Strategy Model
      </h3>

      <div className="flex flex-col gap-3">
        {scenarios.map((sc) => {
          const isActive = selectedScenario === sc.id;
          const proj = sc.projections;

          return (
            <div
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`cursor-pointer rounded-lg p-4 flex flex-col gap-3 transition-all relative overflow-hidden border ${
                isActive
                  ? "bg-primary/5 border-primary-fixed-dim"
                  : "bg-surface-container-low border-outline-variant hover:bg-surface-container-high"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-fixed-dim"></div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span
                    className={`font-body-md text-body-md font-semibold ${isActive ? "text-primary-fixed-dim" : "text-on-surface"}`}
                  >
                    {sc.name}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {sc.desc}
                  </span>
                </div>
                {isActive ? (
                  <span
                    className="material-symbols-outlined text-primary-fixed-dim"
                    style={{ fontSize: "20px" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-outline-variant"></div>
                )}
              </div>

              {/* Projections Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/30 text-center font-data-mono text-xs">
                <div className="flex flex-col">
                  <span className="text-on-surface-variant text-[10px] uppercase">
                    CASA Growth
                  </span>
                  <span
                    className={`font-bold ${proj.casa_growth >= 0 ? "text-[#4ade80]" : "text-error"}`}
                  >
                    +{proj.casa_growth}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-on-surface-variant text-[10px] uppercase">
                    NPA Risk
                  </span>
                  <span
                    className={`font-bold ${proj.npa_risk_movement <= 0 ? "text-[#4ade80]" : "text-error"}`}
                  >
                    {proj.npa_risk_movement > 0
                      ? `+${proj.npa_risk_movement}%`
                      : `${proj.npa_risk_movement}%`}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-on-surface-variant text-[10px] uppercase">
                    RoA Impact
                  </span>
                  <span
                    className={`font-bold ${proj.roa_impact >= 0 ? "text-[#4ade80]" : "text-error"}`}
                  >
                    +{proj.roa_impact}%
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
