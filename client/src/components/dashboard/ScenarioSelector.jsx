import React from "react";

export default function ScenarioSelector({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-title-sm text-title-sm font-semibold text-on-surface px-1">
        Scenario Selection
      </h3>

      {scenarios.map((scenario) => {
        const isActive = scenario.id === selectedScenarioId;
        const isBalanced = scenario.id === "balanced";
        const isAggressive = scenario.id === "aggressive";

        let impactText = "Impact: Low";
        if (isBalanced) impactText = "Impact: Med";
        if (isAggressive) impactText = "Impact: High";

        return (
          <div
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            className={`bg-surface-container border rounded-lg p-4 cursor-pointer transition-all flex flex-col gap-3 relative ${
              isActive
                ? "border-primary shadow-[0_0_15px_rgba(192,193,255,0.1)] opacity-100"
                : "border-outline-variant opacity-70 hover:opacity-90 hover:bg-surface-container-high"
            }`}
          >
            {isActive && (
              <div className="absolute -left-[1px] top-4 bottom-4 w-[3px] bg-primary rounded-r-full"></div>
            )}

            <div
              className={`flex justify-between items-start ${isActive ? "pl-2" : ""}`}
            >
              <h4
                className={`font-title-sm text-title-sm font-semibold ${isActive ? "text-primary" : "text-on-surface"}`}
              >
                {scenario.name}
              </h4>
              <span
                className={`font-data-mono text-data-mono text-xs ${isActive ? "text-primary bg-primary/10 px-2 py-0.5 rounded" : "text-secondary"}`}
              >
                {impactText}
              </span>
            </div>

            <p
              className={`font-body-sm text-body-sm ${isActive ? "text-on-surface-variant pl-2" : "text-secondary line-clamp-2"}`}
            >
              {scenario.description}
            </p>

            {isBalanced && isActive && (
              <div className="mt-2 pl-2 grid grid-cols-3 gap-2 border-t border-outline-variant/50 pt-3">
                <div>
                  <p className="font-label-caps text-[10px] text-secondary uppercase">
                    CASA
                  </p>
                  <p className="font-data-mono text-sm text-primary">
                    +{scenario.casa_growth}%
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-secondary uppercase">
                    NPA
                  </p>
                  <p className="font-data-mono text-sm text-primary">
                    {scenario.npa_risk}
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-secondary uppercase">
                    RoA
                  </p>
                  <p className="font-data-mono text-sm text-primary">
                    +{scenario.roa_impact}%
                  </p>
                </div>
              </div>
            )}

            {!isBalanced && isActive && (
              <div className="mt-2 pl-2 grid grid-cols-3 gap-2 border-t border-outline-variant/50 pt-3">
                <div>
                  <p className="font-label-caps text-[10px] text-secondary uppercase">
                    CASA Growth
                  </p>
                  <p className="font-data-mono text-sm text-primary">
                    +{scenario.casa_growth}%
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-secondary uppercase">
                    NPA Risk
                  </p>
                  <p className="font-data-mono text-sm text-primary">
                    {scenario.npa_risk}
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-secondary uppercase">
                    RoA Impact
                  </p>
                  <p className="font-data-mono text-sm text-primary">
                    +{scenario.roa_impact}%
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
