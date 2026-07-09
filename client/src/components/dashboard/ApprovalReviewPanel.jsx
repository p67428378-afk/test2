import React from "react";
import PropTypes from "prop-types";

export default function ApprovalReviewPanel({
  scenarioData,
  onSubmit,
  isSubmitting,
}) {
  if (!scenarioData) {
    return (
      <div className="bg-surface border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] p-4 text-center text-secondary font-body-sm text-body-sm">
        Loading scenario details...
      </div>
    );
  }

  const { scenario_name = "", action_counts, guardrails } = scenarioData;

  // Safely format the scenario name
  const formattedScenarioName =
    typeof scenario_name === "string" && scenario_name.length > 0
      ? scenario_name.charAt(0).toUpperCase() + scenario_name.slice(1)
      : "Selected";

  // Check if all guardrails passed (including the new Aisle Layout Score)
  const allGuardrailsPassed = guardrails
    ? !!(
        guardrails.private_brand_passed &&
        guardrails.shelf_capacity_passed &&
        guardrails.new_items_passed &&
        guardrails.aisle_layout_score_passed !== false // Default to true if undefined
      )
    : false;

  return (
    <div className="bg-surface border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-4">
      <h3 className="font-headline-sm text-headline-sm text-on-surface">
        Approval Review
      </h3>

      <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant space-y-2">
        <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-2">
          {formattedScenarioName} Scenario Summary
        </div>
        <div className="flex justify-between font-body-sm text-body-sm">
          <span className="text-on-surface">GROW Actions:</span>
          <span className="font-bold text-tertiary">
            {action_counts?.grow ?? 0}
          </span>
        </div>
        <div className="flex justify-between font-body-sm text-body-sm">
          <span className="text-on-surface">MAINTAIN Actions:</span>
          <span className="font-bold text-secondary">
            {action_counts?.maintain ?? 0}
          </span>
        </div>
        <div className="flex justify-between font-body-sm text-body-sm">
          <span className="text-on-surface">SWAP Actions:</span>
          <span className="font-bold text-primary">
            {action_counts?.swap ?? 0}
          </span>
        </div>
        <div className="flex justify-between font-body-sm text-body-sm">
          <span className="text-on-surface">REDUCE Actions:</span>
          <span className="font-bold text-error">
            {action_counts?.reduce ?? 0}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
          Guardrail Checks
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined filled-icon text-sm ${guardrails?.private_brand_passed ? "text-tertiary" : "text-error"}`}
            >
              {guardrails?.private_brand_passed ? "check_circle" : "cancel"}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface">
              PRIVATE BRAND % &gt; 20%
            </span>
          </div>
          <span
            className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded ${guardrails?.private_brand_passed ? "bg-tertiary/10 text-tertiary" : "bg-error-container text-on-error-container"}`}
          >
            {guardrails?.private_brand_passed ? "PASSED" : "FAILED"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined filled-icon text-sm ${guardrails?.shelf_capacity_passed ? "text-tertiary" : "text-error"}`}
            >
              {guardrails?.shelf_capacity_passed ? "check_circle" : "cancel"}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface">
              Space Capacity &lt; 95%
            </span>
          </div>
          <span
            className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded ${guardrails?.shelf_capacity_passed ? "bg-tertiary/10 text-tertiary" : "bg-error-container text-on-error-container"}`}
          >
            {guardrails?.shelf_capacity_passed ? "PASSED" : "FAILED"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined filled-icon text-sm ${guardrails?.new_items_passed ? "text-tertiary" : "text-error"}`}
            >
              {guardrails?.new_items_passed ? "check_circle" : "cancel"}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface">
              New Items &lt; 10%
            </span>
          </div>
          <span
            className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded ${guardrails?.new_items_passed ? "bg-tertiary/10 text-tertiary" : "bg-error-container text-on-error-container"}`}
          >
            {guardrails?.new_items_passed ? "PASSED" : "FAILED"}
          </span>
        </div>

        {/* New Guardrail Check: Aisle Layout Score */}
        <div className="flex items-center justify-between border-t border-outline-variant/50 pt-2 mt-2">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined filled-icon text-sm ${guardrails?.aisle_layout_score_passed ? "text-tertiary" : "text-error"}`}
            >
              {guardrails?.aisle_layout_score_passed
                ? "check_circle"
                : "cancel"}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface">
              Aisle Layout Score &gt; 90%
              {guardrails?.aisle_layout_score !== undefined && (
                <span className="text-secondary ml-1">
                  ({guardrails.aisle_layout_score.toFixed(1)}%)
                </span>
              )}
            </span>
          </div>
          <span
            className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded ${guardrails?.aisle_layout_score_passed ? "bg-tertiary/10 text-tertiary" : "bg-error-container text-on-error-container"}`}
          >
            {guardrails?.aisle_layout_score_passed ? "PASSED" : "FAILED"}
          </span>
        </div>
      </div>

      <div className="flex justify-center w-full mt-2">
        <button
          onClick={onSubmit}
          disabled={!allGuardrailsPassed || isSubmitting}
          className={`w-full max-w-xs font-headline-sm text-headline-sm py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 ${
            allGuardrailsPassed
              ? "bg-primary-container text-on-primary-fixed cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span>
            {isSubmitting ? "Submitting..." : "Submit Assortment Changes"}
          </span>
          <span className="material-symbols-outlined pr-1">send</span>
        </button>
      </div>
    </div>
  );
}

ApprovalReviewPanel.propTypes = {
  scenarioData: PropTypes.shape({
    scenario_name: PropTypes.string,
    action_counts: PropTypes.shape({
      grow: PropTypes.number,
      maintain: PropTypes.number,
      reduce: PropTypes.number,
      swap: PropTypes.number,
    }),
    guardrails: PropTypes.shape({
      private_brand_passed: PropTypes.bool,
      shelf_capacity_passed: PropTypes.bool,
      new_items_passed: PropTypes.bool,
      aisle_layout_score_passed: PropTypes.bool,
      aisle_layout_score: PropTypes.number,
    }),
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};
