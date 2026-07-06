import React from "react";

export default function ApprovalReviewPanel({
  selectedScenario,
  scenarioData,
  onSubmit,
  isSubmitting,
}) {
  const actions = scenarioData?.sku_actions || [
    "Add CV Extreme Cheddar",
    "Swap Doritos with CV Ranch",
    "Reduce CV Cheese Crackers space",
  ];

  const guardrails = scenarioData?.guardrails || {
    private_brand_check: {
      message: "Private Brand ≥ 30% (Proj: 31.5%)",
      passed: true,
    },
    capacity_check: { message: "Capacity ≤ 100% (Proj: 96.0%)", passed: true },
    swap_limit_check: { message: "Swap Limit ≤ 3 (Actual: 1)", passed: true },
  };

  const allPassed = Object.values(guardrails).every((g) => g.passed);

  return (
    <div className="bg-surface-card border border-subtle rounded flex flex-col p-md flex-1 overflow-y-auto justify-between">
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">
          Scenario Approval Review
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
          Selected: {selectedScenario} Assortment Strategy
        </p>

        <div className="mb-md">
          <h3 className="font-label-caps text-label-caps text-[#94A3B8] mb-xs">
            Action List
          </h3>
          <ul className="font-body-sm text-body-sm text-on-surface space-y-1 ml-4 list-disc marker:text-[#334155]">
            {actions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-label-caps text-label-caps text-[#94A3B8] mb-xs">
            Guardrail Checks
          </h3>
          <div className="space-y-2">
            {Object.entries(guardrails).map(([key, check]) => (
              <div
                key={key}
                className="flex items-center gap-xs font-body-sm text-body-sm text-on-surface"
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    check.passed
                      ? "text-semantic-success"
                      : "text-semantic-danger"
                  }`}
                  style={
                    check.passed ? { fontVariationSettings: "'FILL' 1" } : {}
                  }
                >
                  {check.passed ? "check_circle" : "cancel"}
                </span>
                {check.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!allPassed || isSubmitting}
        className={`w-full mt-md text-[#0F172A] font-bold font-body-md py-sm px-md rounded flex items-center justify-center gap-xs transition-all ${
          allPassed && !isSubmitting
            ? "bg-primary-container hover:bg-[#e6bd00] cursor-pointer"
            : "bg-primary-container opacity-50 cursor-not-allowed"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {allPassed ? "send" : "lock"}
        </span>
        {isSubmitting ? "Submitting..." : "Submit Assortment Plan"}
      </button>
    </div>
  );
}
