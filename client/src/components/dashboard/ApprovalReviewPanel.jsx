import React from "react";

export default function ApprovalReviewPanel({
  selectedScenario,
  scenarioData,
  onSubmit,
  isSubmitting,
}) {
  if (!scenarioData) {
    return (
      <div className="bg-surface-container-highest border border-outline-variant rounded-lg p-6 flex items-center justify-center">
        <span className="text-on-surface-variant text-sm">
          Loading scenario data...
        </span>
      </div>
    );
  }

  const { recommended_actions, guardrail_checks } = scenarioData;

  const getActionColor = (action) => {
    const a = action.toUpperCase();
    if (a === "GROW") return "text-[#4ade80]";
    if (a === "MAINTAIN") return "text-secondary-fixed-dim";
    if (a === "REDUCE") return "text-error";
    return "text-tertiary-container";
  };

  const getActionDotColor = (action) => {
    const a = action.toUpperCase();
    if (a === "GROW") return "bg-[#4ade80]";
    if (a === "MAINTAIN") return "bg-secondary-fixed-dim";
    if (a === "REDUCE") return "bg-error";
    return "bg-tertiary-container";
  };

  const isPassed = (status) => {
    return status === "PASSED" || status === true;
  };

  return (
    <div className="bg-surface-container-highest border border-outline-variant rounded-lg flex flex-col mt-4 relative overflow-hidden shadow-lg shadow-black/20">
      {/* Glassy header accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent opacity-50"></div>

      <div className="p-4 border-b border-outline-variant/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-primary-fixed-dim"
            style={{ fontSize: "18px" }}
          >
            verified_user
          </span>
        </div>
        <div>
          <h4 className="font-headline-sm text-[16px] font-semibold text-on-surface leading-tight">
            Approval Review
          </h4>
          <p className="text-xs text-primary-fixed-dim uppercase">
            {selectedScenario} Scenario Active
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Action Summary */}
        <div className="flex flex-col gap-2">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">
            Proposed Actions
          </p>
          <ul className="flex flex-col gap-1.5 font-data-mono text-data-mono text-xs max-h-48 overflow-y-auto pr-1">
            {recommended_actions?.map((act, idx) => (
              <li key={idx} className="flex items-center gap-2 text-on-surface">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${getActionDotColor(act.action)}`}
                ></span>
                <span
                  className={`${getActionColor(act.action)} font-bold w-16`}
                >
                  {act.action}:
                </span>
                <span
                  className="truncate max-w-[180px]"
                  title={act.product_name}
                >
                  {act.product_name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-outline-variant/50" />

        {/* Guardrails */}
        <div className="flex flex-col gap-2">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">
            Guardrail Checks
          </p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <div className="flex items-center gap-1.5">
              <span
                className={`material-symbols-outlined ${isPassed(guardrail_checks?.rbi_exposure_norms) ? "text-[#4ade80]" : "text-error"}`}
                style={{ fontSize: "16px" }}
              >
                {isPassed(guardrail_checks?.rbi_exposure_norms)
                  ? "check"
                  : "close"}
              </span>
              <span className="text-xs text-on-surface-variant">
                RBI Exposure
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`material-symbols-outlined ${isPassed(guardrail_checks?.kyc_aml_flags) ? "text-[#4ade80]" : "text-error"}`}
                style={{ fontSize: "16px" }}
              >
                {isPassed(guardrail_checks?.kyc_aml_flags) ? "check" : "close"}
              </span>
              <span className="text-xs text-on-surface-variant">KYC/AML</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`material-symbols-outlined ${isPassed(guardrail_checks?.pmla_2002_screening) ? "text-[#4ade80]" : "text-error"}`}
                style={{ fontSize: "16px" }}
              >
                {isPassed(guardrail_checks?.pmla_2002_screening)
                  ? "check"
                  : "close"}
              </span>
              <span className="text-xs text-on-surface-variant">PMLA 2002</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`material-symbols-outlined ${isPassed(guardrail_checks?.minimum_casa_floor) ? "text-[#4ade80]" : "text-error"}`}
                style={{ fontSize: "16px" }}
              >
                {isPassed(guardrail_checks?.minimum_casa_floor)
                  ? "check"
                  : "close"}
              </span>
              <span className="text-xs text-on-surface-variant">
                CASA Floor (35%)
              </span>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full mt-2 bg-inverse-primary hover:bg-primary-container text-white font-body-md font-semibold py-2.5 rounded-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-inverse-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Decision"}
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            send
          </span>
        </button>
      </div>
    </div>
  );
}
