import React from "react";
import PropTypes from "prop-types";

export default function ScenarioSelector({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
}) {
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 text-center text-on-surface-variant">
        No scenarios available.
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
        Scenario Selector
      </h3>
      <div className="flex flex-col gap-3">
        {scenarios.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId;
          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 flex flex-col gap-2 ${
                isSelected
                  ? "border-2 border-primary-container bg-primary-container/5 shadow-[0_4px_12px_rgba(16,185,129,0.08)]"
                  : "border-[#E2E8F0] hover:border-outline-variant hover:bg-surface-bright"
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}
                >
                  {scenario.name}
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined text-primary-container icon-fill text-lg">
                    check_circle
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {scenario.description}
              </p>

              {/* Projections Grid */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-dashed border-[#E2E8F0] text-[11px] font-semibold">
                <div className="flex flex-col">
                  <span className="text-on-surface-variant font-normal">
                    CASA Growth
                  </span>
                  <span className="text-primary font-bold">
                    +{scenario.casa_growth}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-on-surface-variant font-normal">
                    NPA Risk
                  </span>
                  <span
                    className={`font-bold ${scenario.npa_risk.toLowerCase() === "low" ? "text-primary" : scenario.npa_risk.toLowerCase() === "medium" ? "text-[#F59E0B]" : "text-error"}`}
                  >
                    {scenario.npa_risk}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-on-surface-variant font-normal">
                    RoA Impact
                  </span>
                  <span className="text-tertiary font-bold">
                    +{scenario.roa_impact}%
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

ScenarioSelector.propTypes = {
  scenarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      casa_growth: PropTypes.number.isRequired,
      npa_risk: PropTypes.string.isRequired,
      roa_impact: PropTypes.number.isRequired,
    }),
  ).isRequired,
  selectedScenarioId: PropTypes.string.isRequired,
  onSelectScenario: PropTypes.func.isRequired,
};
