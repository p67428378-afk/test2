import React from "react";

export default function ApprovalReviewPanel({
  selectedScenario,
  isSubmitting,
  onSubmit,
}) {
  const scenarioLabel = selectedScenario?.label || "Balanced";

  // Action breakdown counts based on scenario type or default
  const actionCounts = {
    conservative: { grow: 8, maintain: 12, swap: 2, reduce: 1 },
    balanced: { grow: 12, maintain: 8, swap: 3, reduce: 2 },
    aggressive: { grow: 18, maintain: 5, swap: 5, reduce: 4 },
  }[selectedScenario?.id || "balanced"] || {
    grow: 12,
    maintain: 8,
    swap: 3,
    reduce: 2,
  };

  const pbShareProjected = selectedScenario?.projected_pb_share_pct || 28.5;
  const pbSharePassed = pbShareProjected >= 25.0;

  return (
    <div className="bg-dg-slate border border-dg-slate-light rounded-xl p-density-comfortable sticky top-margin glass-panel">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dg-slate-light">
        <span className="material-symbols-outlined text-primary-container">
          fact_check
        </span>
        <h3 className="font-title-sm text-title-sm text-on-surface">
          {scenarioLabel} Strategy Summary
        </h3>
      </div>

      {/* Action Breakdown */}
      <div className="mb-6">
        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3">
          Recommended Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-dg-navy/50 border border-dg-slate-light rounded p-2 flex flex-col items-center justify-center">
            <span className="font-display-lg text-display-lg text-emerald-400">
              {actionCounts.grow}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Grow
            </span>
          </div>
          <div className="bg-dg-navy/50 border border-dg-slate-light rounded p-2 flex flex-col items-center justify-center">
            <span className="font-display-lg text-display-lg text-blue-400">
              {actionCounts.maintain}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Maintain
            </span>
          </div>
          <div className="bg-dg-navy/50 border border-dg-slate-light rounded p-2 flex flex-col items-center justify-center">
            <span className="font-display-lg text-display-lg text-amber-500">
              {actionCounts.swap}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Swap
            </span>
          </div>
          <div className="bg-dg-navy/50 border border-dg-slate-light rounded p-2 flex flex-col items-center justify-center">
            <span className="font-display-lg text-display-lg text-red-500">
              {actionCounts.reduce}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              Reduce
            </span>
          </div>
        </div>
      </div>

      {/* Guardrails Checklist */}
      <div className="mb-6">
        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3">
          Guardrail Validation
        </h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 bg-dg-navy/30 p-2 rounded border border-dg-slate-light/50">
            <span
              className={`material-symbols-outlined text-[18px] mt-0.5 ${pbSharePassed ? "text-emerald-400" : "text-amber-400"}`}
            >
              {pbSharePassed ? "check_circle" : "warning"}
            </span>
            <div>
              <div className="font-data-mono text-data-mono text-on-surface">
                Min Private Brand Share
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                Target 25% | Projected {pbShareProjected.toFixed(1)}%
              </div>
            </div>
          </li>
          <li className="flex items-start gap-2 bg-dg-navy/30 p-2 rounded border border-dg-slate-light/50">
            <span className="material-symbols-outlined text-emerald-400 text-[18px] mt-0.5">
              check_circle
            </span>
            <div>
              <div className="font-data-mono text-data-mono text-on-surface">
                Maintained In-Stock Rate
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                Target 95% | Projected 96.2%
              </div>
            </div>
          </li>
          <li className="flex items-start gap-2 bg-dg-navy/30 p-2 rounded border border-dg-slate-light/50">
            <span className="material-symbols-outlined text-emerald-400 text-[18px] mt-0.5">
              check_circle
            </span>
            <div>
              <div className="font-data-mono text-data-mono text-on-surface">
                Shelf Capacity Validated
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                120 ft allocated | No overages
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* CTA Button */}
      <div className="pt-4 border-t border-dg-slate-light mt-auto">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary-container text-dg-navy hover:bg-primary-fixed font-data-mono text-data-mono font-bold py-3 rounded-md transition-all shadow-[0_0_10px_rgba(255,194,14,0.3)] hover:shadow-[0_0_15px_rgba(255,194,14,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin material-symbols-outlined text-[18px]">
                progress_activity
              </span>
              Submitting Recommendation...
            </>
          ) : (
            <>
              Submit Assortment Recommendation
              <span className="material-symbols-outlined text-[18px]">
                send
              </span>
            </>
          )}
        </button>
        <p className="text-center font-label-caps text-label-caps text-on-surface-variant mt-3 text-[10px]">
          Requires Senior VP Approval for implementations &gt; $50k delta.
        </p>
      </div>
    </div>
  );
}
