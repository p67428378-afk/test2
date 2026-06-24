import React from "react";
import PropTypes from "prop-types";

export default function ScenarioSelector({
  scenarios,
  selectedScenario,
  onSelectScenario,
}) {
  const getRiskBadge = (name) => {
    switch (name) {
      case "Conservative":
        return {
          text: "LOW RISK",
          class: "text-on-surface-variant bg-surface-container-high",
        };
      case "Balanced":
        return {
          text: "OPTIMAL",
          class: "text-primary-container bg-primary-container/10",
        };
      case "Aggressive":
        return { text: "HIGH RISK", class: "text-[#f87171] bg-[#f87171]/10" };
      default:
        return {
          text: "STANDARD",
          class: "text-on-surface-variant bg-surface-container-high",
        };
    }
  };

  const getDescription = (name) => {
    switch (name) {
      case "Conservative":
        return "Minimize swap-outs, prioritize high-velocity core items only.";
      case "Balanced":
        return "Optimize private brand growth with targeted national brand swaps.";
      case "Aggressive":
        return "Max private brand conversion, high innovation SKU density.";
      default:
        return "Custom assortment scenario plan.";
    }
  };

  return (
    <section className="flex flex-col gap-md">
      <h2 className="font-title-md text-title-md text-white">
        Scenario Selection
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
        {scenarios.map((scenario) => {
          const isSelected =
            selectedScenario && selectedScenario.name === scenario.name;
          const risk = getRiskBadge(scenario.name);
          const desc = getDescription(scenario.name);

          return (
            <button
              key={scenario.name}
              onClick={() => onSelectScenario(scenario)}
              className={`p-md bg-surface-container-low rounded-lg text-left relative overflow-hidden group transition-all duration-200 ${
                isSelected
                  ? "border-2 border-primary-container shadow-lg"
                  : "border border-outline-variant hover:border-outline"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 p-1 bg-primary-container text-on-primary">
                  <span className="material-symbols-outlined text-[12px] font-bold">
                    check
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center mb-xs">
                <span
                  className={`font-label-md text-label-md ${isSelected ? "text-white font-bold" : "text-on-surface-variant group-hover:text-on-surface"}`}
                >
                  {scenario.name} Plan
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${risk.class}`}
                >
                  {risk.text}
                </span>
              </div>
              <p
                className={`text-[11px] mb-md ${isSelected ? "text-on-surface" : "text-on-surface-variant"}`}
              >
                {desc}
              </p>
              <div className="mt-auto pt-sm border-t border-outline-variant/30 grid grid-cols-2 gap-y-1 text-[10px] text-on-surface-variant">
                <div>
                  Sales/Ft:{" "}
                  <span className="text-white font-semibold">
                    ${scenario.projected_impact.sales_per_linear_ft.toFixed(1)}
                  </span>
                </div>
                <div>
                  PB Mix:{" "}
                  <span className="text-white font-semibold">
                    {scenario.projected_impact.private_brand_percent.toFixed(1)}
                    %
                  </span>
                </div>
                <div>
                  In-Stock:{" "}
                  <span className="text-white font-semibold">
                    {scenario.projected_impact.in_stock_rate.toFixed(1)}%
                  </span>
                </div>
                <div>
                  Capacity:{" "}
                  <span className="text-white font-semibold">
                    {scenario.projected_impact.shelf_capacity}"
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

ScenarioSelector.propTypes = {
  scenarios: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      projected_impact: PropTypes.shape({
        sales_per_linear_ft: PropTypes.number.isRequired,
        private_brand_percent: PropTypes.number.isRequired,
        in_stock_rate: PropTypes.number.isRequired,
        shelf_capacity: PropTypes.number.isRequired,
      }).isRequired,
      guardrails: PropTypes.shape({
        private_brand_target_passed: PropTypes.bool.isRequired,
        sales_target_passed: PropTypes.bool.isRequired,
        shelf_capacity_passed: PropTypes.bool.isRequired,
      }).isRequired,
      sku_actions: PropTypes.arrayOf(
        PropTypes.shape({
          sku: PropTypes.string.isRequired,
          action: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  selectedScenario: PropTypes.shape({
    name: PropTypes.string.isRequired,
    projected_impact: PropTypes.shape({
      sales_per_linear_ft: PropTypes.number.isRequired,
      private_brand_percent: PropTypes.number.isRequired,
      in_stock_rate: PropTypes.number.isRequired,
      shelf_capacity: PropTypes.number.isRequired,
    }).isRequired,
    guardrails: PropTypes.shape({
      private_brand_target_passed: PropTypes.bool.isRequired,
      sales_target_passed: PropTypes.bool.isRequired,
      shelf_capacity_passed: PropTypes.bool.isRequired,
    }).isRequired,
    sku_actions: PropTypes.arrayOf(
      PropTypes.shape({
        sku: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }),
  onSelectScenario: PropTypes.func.isRequired,
};
