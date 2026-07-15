import React from "react";

export default function InlineConfirmation({ plan, onClose }) {
  if (!plan) return null;

  return (
    <div className="bg-secondary-container text-on-secondary-container px-4 py-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between border border-secondary shadow-lg shadow-secondary/10 gap-4 relative">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined font-bold text-secondary mt-0.5">
          check_circle
        </span>
        <div className="flex flex-col">
          <span className="text-body-md font-body-md font-bold text-on-secondary-container">
            Success! Assortment Plan Submitted Successfully.
          </span>
          <span className="text-sm text-on-secondary-container/90 mt-1">
            Scenario{" "}
            <strong className="font-semibold">{plan.scenario_name}</strong> was
            submitted by{" "}
            <strong className="font-semibold">{plan.submitted_by}</strong> on{" "}
            {new Date(plan.created_at).toLocaleString()}.
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs bg-secondary/20 text-on-secondary-container px-2 py-0.5 rounded font-mono">
              ID: {plan.id}
            </span>
            <span className="text-xs bg-secondary/20 text-on-secondary-container px-2 py-0.5 rounded font-mono">
              Audit Trail ID: {plan.audit_trail_id}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-on-secondary-container/20 pt-3 md:pt-0 md:pl-4 shrink-0">
        <button
          onClick={onClose}
          className="text-label-sm font-label-sm bg-on-secondary-container/10 hover:bg-on-secondary-container/20 text-on-secondary-container px-3 py-1.5 rounded transition-colors font-semibold"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
