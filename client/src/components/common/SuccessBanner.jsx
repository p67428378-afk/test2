import React from "react";

export default function SuccessBanner({ proposal, onClose }) {
  if (!proposal) return null;

  return (
    <div className="bg-primary/10 border border-primary/30 p-6 rounded-lg flex flex-col gap-4 relative shadow-[0_0_15px_rgba(192,193,255,0.05)]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
        aria-label="Close banner"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      <div className="flex items-start gap-3">
        <span
          className="material-symbols-outlined text-primary text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="font-title-sm text-title-sm font-semibold text-primary">
            Proposal Submitted Successfully
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            The product promotion proposal has been routed to the regional/zonal
            head for final approval.
          </p>
        </div>
      </div>

      <div className="border-t border-outline-variant/50 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
            Submitted By
          </p>
          <p className="font-body-md text-body-md text-on-surface font-medium">
            {proposal.submitted_by}
          </p>
        </div>
        <div>
          <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
            Routed To
          </p>
          <p className="font-body-md text-body-md text-on-surface font-medium">
            {proposal.routed_to}
          </p>
        </div>
        <div>
          <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
            Guardrails Status
          </p>
          <p className="font-body-md text-body-md text-on-surface font-medium">
            {proposal.guardrails_passed ? (
              <span className="text-primary flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                Passed All
              </span>
            ) : (
              <span className="text-error flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cancel
                </span>
                Failed (RBI/CASA)
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
            Timestamp
          </p>
          <p className="font-body-md text-body-md text-on-surface font-medium font-data-mono text-xs">
            {new Date(proposal.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-3 rounded mt-1">
        <p className="font-label-caps text-[10px] text-secondary uppercase tracking-wider mb-1">
          Audit Trail Summary
        </p>
        <p className="font-data-mono text-xs text-on-surface-variant leading-relaxed break-all">
          {proposal.audit_trail}
        </p>
      </div>
    </div>
  );
}
