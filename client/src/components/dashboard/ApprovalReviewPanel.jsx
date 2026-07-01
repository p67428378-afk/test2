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

  const { scenario_name, action_counts, guardrails } = scenarioData;

  // Check if all guardrails passed
  const allGuardrailsPassed = guardrails
    ? guardrails.private_brand_passed &&
      guardrails.shelf_capacity_passed &&
      guardrails.new_items_passed
    : false;

  return (
    <div className="bg-surface border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-4">
      <h3 className="font-headline-sm text-headline-sm text-on-surface">
        Approval Review
      </h3>

      <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant space-y-2">
        <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-2">
          {scenario_name.charAt(0).toUpperCase() + scenario_name.slice(1)}{" "}
          Scenario Summary
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
              Private Brand % &gt; 20%
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
      </div>

      <button
        onClick={onSubmit}
        disabled={!allGuardrailsPassed || isSubmitting}
        className={`w-full mt-2 font-headline-sm text-headline-sm py-3 rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 ${
          allGuardrailsPassed
            ? "bg-primary-container text-on-primary-fixed cursor-pointer"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        <span>
          {isSubmitting ? "Submitting..." : "Submit Assortment Changes"}
        </span>
        <span className="material-symbols-outlined">send</span>
      </button>
    </div>
  );
}

ApprovalReviewPanel.propTypes = {
  scenarioData: PropTypes.shape({
    scenario_name: PropTypes.string.isRequired,
    action_counts: PropTypes.shape({
      grow: PropTypes.number.isRequired,
      maintain: PropTypes.number.isRequired,
      reduce: PropTypes.number.isRequired,
      swap: PropTypes.number.isRequired,
    }).isRequired,
    guardrails: PropTypes.shape({
      private_brand_passed: PropTypes.bool,
      shelf_capacity_passed: PropTypes.bool,
      new_items_passed: PropTypes.bool,
    }),
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};
