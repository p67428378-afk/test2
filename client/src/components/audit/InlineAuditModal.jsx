import React from "react";

export default function InlineAuditModal({ auditData, onClose }) {
  if (!auditData) return null;

  const {
    audit_reference_id = "AUD-2026-8891",
    status = "APPROVED",
    submitted_by = "Aarchi Jain",
    scenario = "balanced",
    timestamp = new Date().toISOString(),
    summary,
  } = auditData;

  const growCount = summary?.grow_count ?? 12;
  const maintainCount = summary?.maintain_count ?? 8;
  const swapCount = summary?.swap_count ?? 3;
  const reduceCount = summary?.reduce_count ?? 2;
  const guardrailsSatisfied = summary?.guardrails_satisfied ?? true;

  return (
    <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-lg p-4 transition-all duration-300 shadow-lg my-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span
            className="material-symbols-outlined text-emerald-400 text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <div>
            <h4 className="font-title-sm text-title-sm text-emerald-100 flex items-center gap-2">
              Assortment Recommendation Submitted
              <span className="bg-emerald-500/20 text-emerald-300 font-label-caps text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                {status}
              </span>
            </h4>
            <div className="font-data-mono text-data-mono text-emerald-200 mt-1 text-sm space-y-1">
              <div>
                Audit Reference ID:{" "}
                <span className="font-bold text-white">
                  {audit_reference_id}
                </span>
              </div>
              <div className="text-xs text-emerald-300/80">
                Submitted by{" "}
                <span className="font-semibold">{submitted_by}</span> for
                scenario{" "}
                <span className="uppercase font-semibold">{scenario}</span> on{" "}
                {new Date(timestamp).toLocaleString()}
              </div>
            </div>

            {/* Audit Trail Summary Breakdown */}
            <div className="mt-3 pt-2 border-t border-emerald-500/30 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-data-mono">
              <div className="bg-emerald-950/60 p-1.5 rounded border border-emerald-500/20 text-center">
                <span className="text-emerald-400 font-bold block">
                  {growCount}
                </span>
                <span className="text-emerald-200/70 text-[10px]">GROW</span>
              </div>
              <div className="bg-emerald-950/60 p-1.5 rounded border border-emerald-500/20 text-center">
                <span className="text-blue-400 font-bold block">
                  {maintainCount}
                </span>
                <span className="text-emerald-200/70 text-[10px]">
                  MAINTAIN
                </span>
              </div>
              <div className="bg-emerald-950/60 p-1.5 rounded border border-emerald-500/20 text-center">
                <span className="text-amber-400 font-bold block">
                  {swapCount}
                </span>
                <span className="text-emerald-200/70 text-[10px]">SWAP</span>
              </div>
              <div className="bg-emerald-950/60 p-1.5 rounded border border-emerald-500/20 text-center">
                <span className="text-red-400 font-bold block">
                  {reduceCount}
                </span>
                <span className="text-emerald-200/70 text-[10px]">REDUCE</span>
              </div>
              <div className="bg-emerald-950/60 p-1.5 rounded border border-emerald-500/20 text-center col-span-2 sm:col-span-1">
                <span className="text-emerald-400 font-bold block">
                  {guardrailsSatisfied ? "PASSED" : "FLAGGED"}
                </span>
                <span className="text-emerald-200/70 text-[10px]">
                  GUARDRAILS
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="close"
          className="text-emerald-400 hover:text-emerald-200 p-1 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}
