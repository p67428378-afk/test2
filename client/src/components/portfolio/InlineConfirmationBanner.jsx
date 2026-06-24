import React from "react";
import PropTypes from "prop-types";

export default function InlineConfirmationBanner({ decision, onClose }) {
  if (!decision) return null;

  const {
    decision_id,
    scenario_name,
    approver_name,
    timestamp,
    guardrails_passed,
    total_guardrails,
    audit_trail_summary,
  } = decision;

  // Format timestamp nicely
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleString("en-IN", { timeZone: "IST" }) + " IST"
    : new Date().toLocaleString("en-IN") + " IST";

  return (
    <div
      className="w-full bg-emerald-status-light border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3 transition-all"
      data-testid="success-banner"
    >
      <span
        className="material-symbols-outlined text-emerald-status mt-0.5"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        check_circle
      </span>
      <div className="flex-1">
        <h3 className="font-headline-sm text-[16px] text-emerald-status font-bold">
          Submission Successful!
        </h3>
        <p className="font-body-sm text-on-surface mt-1 text-sm">
          {audit_trail_summary}
        </p>
        <div className="mt-3 flex flex-wrap gap-4 font-label-mono text-slate-muted text-xs">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">tag</span>{" "}
            Ref: {decision_id?.substring(0, 8).toUpperCase() || "TXN-98234-PM"}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              schedule
            </span>{" "}
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              verified_user
            </span>{" "}
            Regulatory Traceability: Verified ({guardrails_passed}/
            {total_guardrails} Passed)
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-slate-muted hover:text-on-surface transition-colors"
        aria-label="Close banner"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}

InlineConfirmationBanner.propTypes = {
  decision: PropTypes.shape({
    decision_id: PropTypes.string.isRequired,
    scenario_name: PropTypes.string.isRequired,
    approver_name: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    guardrails_passed: PropTypes.number.isRequired,
    total_guardrails: PropTypes.number.isRequired,
    audit_trail_summary: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};
