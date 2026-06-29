import React from "react";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

export default function ApprovalReviewPanel({
  scenarioName,
  scenarioDetails,
  loading,
  onSubmit,
  submitting,
}) {
  if (loading) {
    return (
      <div className="bg-[#1E293B] border border-outline-variant rounded-lg p-md flex flex-col gap-md h-96 justify-center items-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-on-surface-variant text-sm">
          Loading scenario details...
        </p>
      </div>
    );
  }

  const {
    sku_action_summary = { add: 0, keep: 0, swap: 0, remove: 0 },
    guardrail_checks = [],
  } = scenarioDetails || {};

  return (
    <div className="bg-[#1E293B] border border-outline-variant rounded-lg p-md flex flex-col gap-md h-full justify-between">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
          Approval Review
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Reviewing:{" "}
          <strong className="text-primary font-medium">
            {scenarioName} Scenario
          </strong>
        </p>
      </div>

      {/* SKU Action Summary */}
      <div className="bg-surface-container-low p-sm rounded border border-outline-variant/50 flex flex-col gap-xs">
        <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
          SKU Action Summary
        </p>
        <div className="grid grid-cols-4 gap-xs text-center mt-1">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-1">
            <p className="text-emerald-400 font-bold text-sm">
              {sku_action_summary.add}
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase">Add</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded p-1">
            <p className="text-blue-400 font-bold text-sm">
              {sku_action_summary.keep}
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase">
              Keep
            </p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded p-1">
            <p className="text-amber-400 font-bold text-sm">
              {sku_action_summary.swap}
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase">
              Swap
            </p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded p-1">
            <p className="text-rose-400 font-bold text-sm">
              {sku_action_summary.remove}
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase">
              Remove
            </p>
          </div>
        </div>
      </div>

      {/* Guardrail Checks */}
      <div className="flex flex-col gap-sm border-t border-b border-outline-variant py-sm my-2">
        <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
          Guardrail Checks
        </p>
        {guardrail_checks.length === 0 ? (
          <div className="flex items-center gap-sm text-on-surface-variant text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>No guardrail checks available.</span>
          </div>
        ) : (
          guardrail_checks.map((check, idx) => {
            const isPassed = check.status === "PASSED";
            return (
              <div key={idx} className="flex items-start gap-sm">
                {isPassed ? (
                  <CheckCircle2 className="text-emerald-400 h-5 w-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="text-rose-400 h-5 w-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">
                    {check.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {check.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-col gap-sm mt-auto">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary/90 text-on-primary-container font-semibold py-3 rounded transition-colors flex justify-center items-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit for Approval</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
        <p className="font-label-sm text-label-sm text-center text-on-surface-variant opacity-70">
          Submitting creates an active audit trail.
        </p>
      </div>
    </div>
  );
}
