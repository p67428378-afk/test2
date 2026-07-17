import React from "react";

export default function ApprovalReviewPanel({
  selectedScenario,
  onSubmit,
  isSubmitting,
}) {
  if (!selectedScenario) return null;

  const getGuardrailBadge = (status) => {
    if (status === "Passed") {
      return (
        <span className="font-label-md text-label-md text-primary-container flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">
            check_circle
          </span>
          Passed
        </span>
      );
    }
    return (
      <span className="font-label-md text-label-md text-secondary flex items-center gap-1">
        <span className="material-symbols-outlined text-[16px]">warning</span>
        Warning
      </span>
    );
  };

  return (
    <div className="lg:col-span-1 card-bg border border-outline-variant rounded-lg p-5 flex flex-col shadow-sm relative overflow-hidden">
      {/* Subtle background mesh/gradient to indicate action area */}
      <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2 relative z-10">
        Scenario Review:{" "}
        <span className="text-primary-container">{selectedScenario.name}</span>
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 pb-4 border-b border-outline-variant relative z-10">
        {selectedScenario.description} Plan entails swapping{" "}
        {selectedScenario.swaps_count} underperforming national brand SKUs for
        Clover Valley equivalents to reach{" "}
        {selectedScenario.private_brand_pct?.toFixed(1)}% PB penetration.
      </p>
      <div className="space-y-4 mb-6 flex-1 relative z-10">
        <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
          Guardrail Checks
        </h3>

        <div className="flex justify-between items-center bg-surface-container-low p-2 rounded">
          <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[16px] ${selectedScenario.guardrails?.private_brand_share === "Passed" ? "text-primary-container" : "text-secondary"}`}
            >
              {selectedScenario.guardrails?.private_brand_share === "Passed"
                ? "check_circle"
                : "warning"}
            </span>
            Private Brand Share
          </span>
          {getGuardrailBadge(selectedScenario.guardrails?.private_brand_share)}
        </div>

        <div className="flex justify-between items-center bg-surface-container-low p-2 rounded">
          <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[16px] ${selectedScenario.guardrails?.shelf_space_limits === "Passed" ? "text-primary-container" : "text-secondary"}`}
            >
              {selectedScenario.guardrails?.shelf_space_limits === "Passed"
                ? "check_circle"
                : "warning"}
            </span>
            Shelf Space Limits
          </span>
          {getGuardrailBadge(selectedScenario.guardrails?.shelf_space_limits)}
        </div>

        <div className="flex justify-between items-center bg-surface-container-low p-2 rounded">
          <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[16px] ${selectedScenario.guardrails?.gm_pct_impact === "Passed" ? "text-primary-container" : "text-secondary"}`}
            >
              {selectedScenario.guardrails?.gm_pct_impact === "Passed"
                ? "check_circle"
                : "warning"}
            </span>
            GM% Impact
          </span>
          {getGuardrailBadge(selectedScenario.guardrails?.gm_pct_impact)}
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg font-bold hover:bg-primary transition-colors shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 mt-auto relative z-10 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">send</span>
        {isSubmitting ? "Submitting Plan..." : "Submit Assortment Plan"}
      </button>
    </div>
  );
}
