import React from "react";
import PropTypes from "prop-types";

export default function ScenarioSelector({
  scenarios,
  selectedScenario,
  onSelectScenario,
  loading,
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-stack-tight">
        <h2 className="font-title-md text-title-md text-[#F8FAFC] pl-1">
          Strategic Scenario Simulation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-subtle rounded-xl p-card-padding animate-pulse h-40"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-stack-tight">
      <h2 className="font-title-md text-title-md text-[#F8FAFC] pl-1">
        Strategic Scenario Simulation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {scenarios &&
          scenarios.map((scenario) => {
            const isSelected = selectedScenario?.id === scenario.id;
            return (
              <div
                key={scenario.id}
                onClick={() => onSelectScenario(scenario)}
                className={`p-card-padding rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#1E293B] border-2 border-[#6366F1] relative shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-card border border-subtle hover:border-[#64748B]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-[#6366F1] text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">
                      check
                    </span>
                  </div>
                )}
                <h4
                  className={`font-label-md text-label-md uppercase mb-1 ${isSelected ? "text-[#818CF8]" : "text-[#F8FAFC]"}`}
                >
                  {scenario.name}
                </h4>
                <p className="text-muted font-body-sm text-body-sm mb-4 h-8">
                  {scenario.name === "Conservative" &&
                    "Low risk, steady growth."}
                  {scenario.name === "Balanced" &&
                    "Moderate risk, optimized growth."}
                  {scenario.name === "Aggressive" &&
                    "High risk, maximum growth."}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono-data text-mono-data text-sm">
                    <span
                      className={isSelected ? "text-[#CBD5E1]" : "text-muted"}
                    >
                      CASA
                    </span>
                    <span className="text-[#34D399] font-bold">
                      +{scenario.casa_growth_projection}%
                    </span>
                  </div>
                  <div className="flex justify-between font-mono-data text-mono-data text-sm">
                    <span
                      className={isSelected ? "text-[#CBD5E1]" : "text-muted"}
                    >
                      NPA
                    </span>
                    <span
                      className={`${scenario.npa_risk_projection === "High" ? "text-[#F87171]" : scenario.npa_risk_projection === "Moderate" ? "text-[#FBBF24]" : "text-[#34D399]"} font-bold`}
                    >
                      {scenario.npa_risk_projection === "Low"
                        ? "-0.5%"
                        : scenario.npa_risk_projection === "Moderate"
                          ? "+0.2%"
                          : "+1.5%"}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono-data text-mono-data text-sm">
                    <span
                      className={isSelected ? "text-[#CBD5E1]" : "text-muted"}
                    >
                      RoA
                    </span>
                    <span className="text-[#34D399] font-bold">
                      +{scenario.roa_impact_projection}%
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
      casa_growth_projection: PropTypes.number.isRequired,
      npa_risk_projection: PropTypes.string.isRequired,
      roa_impact_projection: PropTypes.number.isRequired,
    }),
  ),
  selectedScenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onSelectScenario: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
