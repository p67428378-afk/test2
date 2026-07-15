import React from "react";

export default function ScenarioSelector({
  selectedScenario,
  onSelectScenario,
}) {
  const scenarios = [
    {
      name: "Conservative",
      sales: "+1.5%",
      pb: "28.8%",
      desc: "Focuses on low-risk, high-certainty adjustments.",
    },
    {
      name: "Balanced",
      sales: "+4.2%",
      pb: "29.5%",
      desc: "Balances sales performance with private brand goals.",
    },
    {
      name: "Aggressive",
      sales: "+8.5%",
      pb: "31.2%",
      desc: "Maximizes private brand penetration and sales growth.",
    },
  ];

  return (
    <div className="dg-card rounded-xl p-4 flex flex-col gap-4">
      <h3 className="text-headline-md font-headline-md text-on-surface">
        Assortment Scenarios
      </h3>
      <div className="flex flex-col gap-3">
        {scenarios.map((sc) => {
          const isSelected =
            selectedScenario.toLowerCase() === sc.name.toLowerCase();
          return (
            <div
              key={sc.name}
              onClick={() => onSelectScenario(sc.name)}
              className={`border rounded-lg p-3 transition-all cursor-pointer relative ${
                isSelected
                  ? "border-2 border-dg-amber bg-surface-container-low shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                  : "border-surface-container-highest bg-surface-container-lowest hover:border-surface-container-high"
              }`}
            >
              {isSelected && (
                <span
                  className="material-symbols-outlined absolute top-3 right-3 text-dg-amber text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-body-md font-body-md font-semibold text-on-surface">
                  {sc.name}
                </span>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {sc.desc}
                </p>
                <div className="mt-2 flex flex-col gap-1 border-t border-surface-container-highest/50 pt-2">
                  <div className="flex justify-between">
                    <span className="text-label-sm font-label-sm text-on-surface-variant">
                      Projected Sales:
                    </span>
                    <span className="text-label-sm font-label-sm text-secondary">
                      {sc.sales}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-label-sm font-label-sm text-on-surface-variant">
                      Private Brand:
                    </span>
                    <span className="text-label-sm font-label-sm text-on-surface">
                      {sc.pb}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
