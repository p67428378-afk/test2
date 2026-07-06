import React from "react";

export default function ScenarioSelector({
  selectedScenario,
  onSelectScenario,
  scenarioData,
}) {
  const scenarios = [
    {
      id: "Conservative",
      title: "Conservative",
      metrics: [
        { label: "Margin", value: "31.2%" },
        { label: "Vol", value: "+1.5%" },
      ],
    },
    {
      id: "Balanced",
      title: "Balanced",
      metrics: [
        { label: "Margin", value: "32.8%" },
        { label: "Vol", value: "+4.2%", highlight: true },
      ],
    },
    {
      id: "Aggressive",
      title: "Aggressive",
      metrics: [
        { label: "Margin", value: "34.1%" },
        { label: "Risk", value: "High", warning: true },
      ],
    },
  ];

  return (
    <div className="bg-surface-card border border-subtle rounded flex flex-col p-md shrink-0">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
        Assortment Scenario Modeling
      </h2>
      <div className="flex gap-sm">
        {scenarios.map((sc) => {
          const isSelected = selectedScenario === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`flex-1 border rounded p-sm relative cursor-pointer transition-all ${
                isSelected
                  ? "border-2 border-[#FFD100] bg-[#1E293B] shadow-[0_0_8px_rgba(255,209,0,0.1)]"
                  : "border-subtle bg-[#0F172A] opacity-70 hover:opacity-100"
              }`}
            >
              {isSelected && (
                <span
                  className="material-symbols-outlined absolute top-1 right-1 text-[#FFD100] text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              )}
              <div
                className={`font-label-caps text-label-caps mb-xs ${isSelected ? "text-[#FFD100]" : "text-[#94A3B8]"}`}
              >
                {sc.title}
              </div>
              {sc.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className={`font-data-mono text-[12px] ${
                    m.highlight
                      ? "text-semantic-success"
                      : m.warning
                        ? "text-semantic-warning"
                        : "text-on-surface"
                  }`}
                >
                  {m.label}: {m.value}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
