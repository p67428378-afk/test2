import React from "react";

export default function SuccessBanner({ auditTrail, onClose }) {
  if (!auditTrail) return null;

  const {
    approved_by,
    guardrails_passed,
    log_id,
    scenario_name,
    submission_timestamp,
  } = auditTrail;

  return (
    <div
      className="bg-surface-container-highest border border-[#4ade80] rounded-lg p-6 relative overflow-hidden shadow-lg shadow-black/20 flex flex-col gap-4"
      role="alert"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#4ade80]/5 rounded-full blur-xl"></div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#4ade80]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#4ade80]">
              check_circle
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-[#4ade80]">
              Decision Submitted Successfully
            </h3>
            <p className="text-xs text-on-surface-variant">
              Regulatory audit trail generated and logged
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            close
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-container-lowest/50 p-4 rounded border border-outline-variant/50 font-data-mono text-data-mono text-xs">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between border-b border-outline-variant/30 pb-1.5">
            <span className="text-on-surface-variant">Log ID:</span>
            <span
              className="text-on-surface font-medium truncate max-w-[180px]"
              title={log_id}
            >
              {log_id}
            </span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-1.5">
            <span className="text-on-surface-variant">Approved By:</span>
            <span className="text-on-surface font-medium">{approved_by}</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-1.5">
            <span className="text-on-surface-variant">Scenario:</span>
            <span className="text-primary font-medium uppercase">
              {scenario_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Timestamp:</span>
            <span className="text-on-surface font-medium">
              {new Date(submission_timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-outline-variant/30 pt-2 md:pt-0 md:pl-4">
          <span className="text-on-surface-variant font-semibold mb-1">
            Guardrails Passed:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[#4ade80]"
                style={{ fontSize: "16px" }}
              >
                check
              </span>
              <span className="text-on-surface">RBI Exposure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[#4ade80]"
                style={{ fontSize: "16px" }}
              >
                check
              </span>
              <span className="text-on-surface">KYC/AML</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[#4ade80]"
                style={{ fontSize: "16px" }}
              >
                check
              </span>
              <span className="text-on-surface">PMLA 2002</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[#4ade80]"
                style={{ fontSize: "16px" }}
              >
                check
              </span>
              <span className="text-on-surface">CASA Floor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
