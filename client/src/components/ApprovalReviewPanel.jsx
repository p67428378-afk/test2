import React from "react";
import { useAssortment } from "../context/AssortmentContext.jsx";

export default function ApprovalReviewPanel() {
  const { activeScenario, handleSubmitScenario, submitting, submissionError } =
    useAssortment();

  const guardrails = activeScenario?.guardrails || [
    { name: "Margin floor maintained", passed: true },
    { name: "Shelf capacity neutral", passed: true },
    { name: "Core brand minimums met", passed: true },
  ];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-amber-500 text-2xl">
            admin_panel_settings
          </span>
          <h2 className="font-title-lg text-on-surface text-lg font-bold text-white">
            Approval Review
          </h2>
        </div>

        {/* Active Scenario Card */}
        <div className="bg-[#0F172A] border border-[#334155] rounded p-3 mb-4">
          <div className="font-label-sm text-slate-400 text-[10px] mb-1 uppercase tracking-wider font-semibold">
            Active Scenario
          </div>
          <div className="flex justify-between items-baseline">
            <div className="font-headline-sm text-amber-500 text-xl font-bold">
              {activeScenario?.name || "Balanced"}
            </div>
            <div className="text-xs text-emerald-400 font-mono font-semibold">
              +{activeScenario?.projected_sales_lift_pct}% Projected Lift
            </div>
          </div>
        </div>

        {/* Guardrail Checks */}
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-label-md text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Guardrail Checks
            </h4>
            <div className="space-y-2">
              {guardrails.map((g, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 font-body-sm text-sm text-slate-200"
                >
                  {g.passed !== false ? (
                    <span className="material-symbols-outlined text-emerald-400 text-[16px]">
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-rose-400 text-[16px]">
                      warning
                    </span>
                  )}
                  <span>{g.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Summary breakdown */}
          {activeScenario?.action_summary && (
            <div>
              <h4 className="font-label-md text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                SKU Action Plan
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">GROW:</span>
                  <span className="text-emerald-400 font-bold">
                    {activeScenario.action_summary.GROW || 0} SKUs
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">MAINTAIN:</span>
                  <span className="text-indigo-400 font-bold">
                    {activeScenario.action_summary.MAINTAIN || 0} SKUs
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">SWAP:</span>
                  <span className="text-amber-400 font-bold">
                    {activeScenario.action_summary.SWAP || 0} SKUs
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-400">REDUCE:</span>
                  <span className="text-rose-400 font-bold">
                    {activeScenario.action_summary.REDUCE || 0} SKUs
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {submissionError && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs">
            {submissionError}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmitScenario}
        disabled={submitting}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#0F172A] font-bold text-base py-3 rounded transition-colors shadow-md flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span>Submitting...</span>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Submit & Lock Assortment</span>
          </>
        )}
      </button>
    </div>
  );
}
