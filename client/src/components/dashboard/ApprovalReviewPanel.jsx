import React from "react";

export default function ApprovalReviewPanel({
  scenarioData,
  onSubmit,
  submitting,
  loading,
}) {
  if (loading) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex-grow flex flex-col animate-pulse h-96">
        <div className="h-6 bg-surface-container-highest rounded w-3/4 mb-4"></div>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-surface-container-highest rounded"
            ></div>
          ))}
        </div>
        <div className="h-4 bg-surface-container-highest rounded w-1/2 mb-3"></div>
        <div className="space-y-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 bg-surface-container-highest rounded"
            ></div>
          ))}
        </div>
        <div className="h-12 bg-surface-container-highest rounded mt-auto"></div>
      </div>
    );
  }

  if (!scenarioData) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex-grow flex flex-col justify-center items-center text-on-surface-variant">
        {"No scenario data available."}
      </div>
    );
  }

  const {
    scenario_name = "Balanced",
    projected_metrics = {},
    guardrail_checks = {},
    sku_action_summary = {},
  } = scenarioData;

  const { grow = 0, reduce = 0, swap = 0 } = sku_action_summary;

  const { private_brand_percentage = 0, shelf_capacity = 0 } =
    projected_metrics;

  // Map SKU change percentage based on scenario
  const getSkuChangePct = (name) => {
    switch (name?.toLowerCase()) {
      case "conservative":
        return "-1.0%";
      case "balanced":
        return "-2.0%";
      case "aggressive":
        return "+1.5%";
      default:
        return "0.0%";
    }
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex-grow flex flex-col">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
        {scenario_name}
        {" Scenario Summary"}
      </h3>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-surface p-2 rounded text-center border border-outline-variant">
          <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
            {"Reduce"}
          </div>
          <div className="font-headline-md text-[#EF4444]">{reduce}</div>
        </div>
        <div className="bg-surface p-2 rounded text-center border border-outline-variant">
          <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
            {"Swap"}
          </div>
          <div className="font-headline-md text-[#F59E0B]">{swap}</div>
        </div>
        <div className="bg-surface p-2 rounded text-center border border-outline-variant">
          <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
            {"Grow"}
          </div>
          <div className="font-headline-md text-[#10B981]">{grow}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="font-label-md text-label-md text-on-surface-variant uppercase mb-3">
          {"Guardrail Checks"}
        </div>
        <ul className="flex flex-col gap-2">
          <li className="flex justify-between items-center text-sm">
            <span className="text-on-surface">{"PB% >= 20%"}</span>
            <span
              className={`flex items-center gap-1 font-data-mono ${guardrail_checks.private_brand_passed ? "text-[#10B981]" : "text-[#EF4444]"}`}
            >
              {private_brand_percentage.toFixed(1)}
              {"%"}{" "}
              <span className="material-symbols-outlined text-[16px]">
                {guardrail_checks.private_brand_passed ? "check" : "close"}
              </span>
            </span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-on-surface">{"Shelf Capacity <= 95%"}</span>
            <span
              className={`flex items-center gap-1 font-data-mono ${guardrail_checks.shelf_capacity_passed ? "text-[#10B981]" : "text-[#EF4444]"}`}
            >
              {shelf_capacity.toFixed(1)}
              {"%"}{" "}
              <span className="material-symbols-outlined text-[16px]">
                {guardrail_checks.shelf_capacity_passed ? "check" : "close"}
              </span>
            </span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-on-surface">{"SKU Change <= 10%"}</span>
            <span
              className={`flex items-center gap-1 font-data-mono ${guardrail_checks.sku_count_change_passed ? "text-[#10B981]" : "text-[#EF4444]"}`}
            >
              {getSkuChangePct(scenario_name)}{" "}
              <span className="material-symbols-outlined text-[16px]">
                {guardrail_checks.sku_count_change_passed ? "check" : "close"}
              </span>
            </span>
          </li>
        </ul>
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="mt-auto w-full bg-primary-container text-[#0F172A] font-bold font-body-lg text-body-lg py-3 rounded-lg hover:bg-[#E6BC00] transition-colors shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">{"publish"}</span>
        {submitting ? "Submitting..." : "Submit Assortment Plan"}
      </button>
    </div>
  );
}
