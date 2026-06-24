import React from "react";
import PropTypes from "prop-types";

export default function SuccessBanner({ proposalResult }) {
  if (!proposalResult) return null;

  return (
    <div className="bg-primary-container/10 border border-primary-container rounded-xl p-4 flex items-start gap-3 shadow-sm animate-fadeIn">
      <span className="material-symbols-outlined text-primary-container icon-fill shrink-0 text-2xl">
        check_circle
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-on-surface">
          Proposal submitted to {proposalResult.routed_to}. Guardrails:{" "}
          {proposalResult.guardrails_passed
            ? "Passed"
            : "Failed (CASA Floor, RBI Exposure Norms)"}
        </span>
        <span className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          {proposalResult.audit_trail}
        </span>
      </div>
    </div>
  );
}

SuccessBanner.propTypes = {
  proposalResult: PropTypes.shape({
    routed_to: PropTypes.string.isRequired,
    guardrails_passed: PropTypes.bool.isRequired,
    audit_trail: PropTypes.string.isRequired,
  }),
};
