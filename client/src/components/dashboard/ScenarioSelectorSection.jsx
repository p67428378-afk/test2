import React from "react";
import PropTypes from "prop-types";

export default function ScenarioSelectorSection({
  selectedScenario,
  setSelectedScenario,
  scenariosData,
}) {
  const scenarios = [
    {
      id: "conservative",
      name: "Conservative",
      description: "Focus on core SKUs. Low risk.",
    },
    {
      id: "balanced",
      name: "Balanced",
      description: "Mix of core growth and testing new items.",
    },
    {
      id: "aggressive",
      name: "Aggressive",
      description: "Maximize private label penetration. High risk.",
    },
  ];

  return (
    <div className="bg-surface border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-3">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
        Scenario Selector
      </h3>

      {scenarios.map((sc) => {
        const isSelected = selectedScenario === sc.id;
        const data = scenariosData ? scenariosData[sc.id] : null;

        return (
          <div
            key={sc.id}
            onClick={() => setSelectedScenario(sc.id)}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${
              isSelected
                ? "border-2 border-primary-container bg-surface-bright shadow-sm"
                : "border-outline-variant hover:bg-surface-container"
            }`}
          >
            <div className="flex justify-between items-start">
              <div
                className={`font-label-md text-label-md text-on-surface ${isSelected ? "font-bold" : ""}`}
              >
                {sc.name}
              </div>
              {isSelected && (
                <span className="material-symbols-outlined text-primary-container filled-icon text-sm">
                  check_circle
                </span>
              )}
            </div>
            <div className="font-body-sm text-body-sm text-secondary mt-1">
              {sc.description}
            </div>

            {data && (
              <div className="mt-2 pt-2 border-t border-outline-variant/50 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-label-sm text-[10px] text-secondary uppercase">
                    Sales Impact
                  </div>
                  <div className="font-label-md text-label-md text-on-surface font-bold">
                    {(data.projected_sales_impact_pct ?? 0) >= 0 ? "+" : ""}
                    {(data.projected_sales_impact_pct ?? 0).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="font-label-sm text-[10px] text-secondary uppercase">
                    Private Brand
                  </div>
                  <div className="font-label-md text-label-md text-on-surface font-bold">
                    {(data.projected_private_brand_pct ?? 0).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="font-label-sm text-[10px] text-secondary uppercase">
                    Shelf Cap.
                  </div>
                  <div className="font-label-md text-label-md text-on-surface font-bold">
                    {(data.projected_shelf_capacity_pct ?? 0).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

ScenarioSelectorSection.propTypes = {
  selectedScenario: PropTypes.string.isRequired,
  setSelectedScenario: PropTypes.func.isRequired,
  scenariosData: PropTypes.objectOf(
    PropTypes.shape({
      projected_sales_impact_pct: PropTypes.number,
      projected_private_brand_pct: PropTypes.number,
      projected_shelf_capacity_pct: PropTypes.number,
    }),
  ).isRequired,
};
