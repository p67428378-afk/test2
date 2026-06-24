import React from "react";
import PropTypes from "prop-types";

export default function ScenarioSelector({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  loading,
}) {
  if (loading || !scenarios) {
    return (
      <div
        className="flex flex-col gap-stack_md"
        data-testid="scenarios-loading"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-headline-sm text-on-surface text-lg font-bold">
            Scenario Models
          </h3>
          <span className="font-label-mono text-slate-muted text-[10px]">
            AI GENERATED
          </span>
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="card-surface rounded-lg p-4 animate-pulse h-28 bg-surface-container-low"
          ></div>
        ))}
      </div>
    );
  }

  const getRiskBadge = (name) => {
    if (name === "Aggressive") {
      return (
        <span className="font-label-mono text-[10px] bg-[#0F172A] px-2 py-1 rounded border border-rose-500/30 text-rose-status font-bold">
          Risk: High
        </span>
      );
    }
    if (name === "Conservative") {
      return (
        <span className="font-label-mono text-[10px] bg-[#0F172A] px-2 py-1 rounded border border-emerald-500/30 text-emerald-status font-bold">
          Risk: Low
        </span>
      );
    }
    return (
      <span className="font-label-mono text-[10px] bg-[#0F172A] px-2 py-1 rounded border border-outline-variant text-slate-muted font-bold">
        Risk: Moderate
      </span>
    );
  };

  const getScenarioDescription = (name) => {
    if (name === "Balanced") {
      return "Optimizes for CASA growth while managing PL risk exposure.";
    }
    if (name === "Aggressive") {
      return "Maximizes Asset book expansion; pushes higher yield products.";
    }
    return "Focus on liability generation and strict NPA reduction.";
  };

  return (
    <div className="flex flex-col gap-stack_md">
      <div className="flex justify-between items-center">
        <h3 className="font-headline-sm text-on-surface text-lg font-bold">
          Scenario Models
        </h3>
        <span className="font-label-mono text-slate-muted text-[10px] font-semibold">
          AI GENERATED
        </span>
      </div>

      {scenarios.map((scenario) => {
        const isSelected = scenario.id === selectedScenarioId;
        return (
          <div
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className={`card-surface rounded-lg p-4 cursor-pointer relative transition-all ${
              isSelected
                ? "border-indigo-primary bg-surface-container ring-1 ring-indigo-primary"
                : "hover:bg-surface-container"
            }`}
            data-testid={`scenario-card-${scenario.name}`}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 text-indigo-primary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            )}
            <h4 className="font-body-lg font-bold text-on-surface mb-1 text-base">
              {scenario.name} Scenario
            </h4>
            <p className="font-body-sm text-slate-muted mb-3 text-xs">
              {getScenarioDescription(scenario.name)}
            </p>
            <div className="flex gap-2">
              <span className="font-label-mono text-[10px] bg-[#0F172A] px-2 py-1 rounded border border-outline-variant text-on-surface font-semibold">
                Proj. Yield: {scenario.roa_impact}
              </span>
              {getRiskBadge(scenario.name)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

ScenarioSelector.propTypes = {
  scenarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      casa_growth: PropTypes.string.isRequired,
      npa_risk_movement: PropTypes.string.isRequired,
      roa_impact: PropTypes.string.isRequired,
    }),
  ),
  selectedScenarioId: PropTypes.string,
  onSelectScenario: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
