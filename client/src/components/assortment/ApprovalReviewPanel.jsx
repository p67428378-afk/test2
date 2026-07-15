import React from "react";
import { ShieldCheck, ShieldAlert, Play, Loader2 } from "lucide-react";

export default function ApprovalReviewPanel({
  selectedScenario,
  skuActions,
  skus = [],
  onSubmit,
  submitting,
}) {
  const skuList = Array.isArray(skus) ? skus : [];
  // Calculate projected Private Brand % based on current actions
  const calculateProjectedPB = () => {
    let totalProjectedSales = 0;
    let pbProjectedSales = 0;

    skuList.forEach((sku) => {
      const action =
        skuActions[sku.sku_id] ||
        sku.scenarios?.[selectedScenario]?.action ||
        "MAINTAIN";
      let multiplier = 1.0;
      if (action === "GROW") multiplier = 1.25;
      else if (action === "REDUCE") multiplier = 0.5;
      else if (action === "SWAP") multiplier = 0.0;

      const projectedSales = sku.sales * multiplier;
      totalProjectedSales += projectedSales;
      if (sku.is_private_brand) {
        pbProjectedSales += projectedSales;
      }
    });

    return totalProjectedSales > 0
      ? (pbProjectedSales / totalProjectedSales) * 100
      : 0;
  };

  const projectedPB = calculateProjectedPB();
  const isGuardrailPassed = projectedPB >= 20.0;

  // Count actions
  const actionCounts = { GROW: 0, MAINTAIN: 0, SWAP: 0, REDUCE: 0 };
  skuList.forEach((sku) => {
    const action =
      skuActions[sku.sku_id] ||
      sku.scenarios?.[selectedScenario]?.action ||
      "MAINTAIN";
    if (actionCounts[action] !== undefined) {
      actionCounts[action]++;
    }
  });

  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm p-6 flex flex-col gap-6 h-full justify-between">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-on-surface">
            Approval & Review Panel
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Verify guardrails and review the action summary before submitting
            the assortment plan.
          </p>
        </div>

        {/* Guardrail Status */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            isGuardrailPassed
              ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
              : "bg-rose-50/50 border-rose-200 text-rose-800"
          }`}
        >
          {isGuardrailPassed ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">
              {isGuardrailPassed
                ? "Guardrails Satisfied"
                : "Guardrail Violation"}
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Projected Private Brand Share is{" "}
              <span className="font-bold">{projectedPB.toFixed(1)}%</span>.
              {isGuardrailPassed
                ? " This meets the minimum target of 20.0% for the Small Town Value Cluster."
                : " This falls below the minimum target of 20.0%. Adjust SKU actions to increase Private Brand representation."}
            </p>
          </div>
        </div>

        {/* Action Summary */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Action Summary ({selectedScenario})
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/10 flex justify-between items-center">
              <span className="text-xs font-medium text-on-surface-variant">
                GROW
              </span>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {actionCounts.GROW}
              </span>
            </div>
            <div className="bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/10 flex justify-between items-center">
              <span className="text-xs font-medium text-on-surface-variant">
                MAINTAIN
              </span>
              <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {actionCounts.MAINTAIN}
              </span>
            </div>
            <div className="bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/10 flex justify-between items-center">
              <span className="text-xs font-medium text-on-surface-variant">
                SWAP
              </span>
              <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                {actionCounts.SWAP}
              </span>
            </div>
            <div className="bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/10 flex justify-between items-center">
              <span className="text-xs font-medium text-on-surface-variant">
                REDUCE
              </span>
              <span className="text-sm font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                {actionCounts.REDUCE}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
        <button
          onClick={onSubmit}
          disabled={!isGuardrailPassed || submitting}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
            isGuardrailPassed && !submitting
              ? "bg-primary text-white hover:bg-on-primary-fixed-variant active:scale-[0.98]"
              : "bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed"
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting Plan...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Submit Assortment Plan
            </>
          )}
        </button>
        <p className="text-center text-[10px] text-on-surface-variant/70">
          Submitting will log an audit trail and lock the assortment plan for
          this cycle.
        </p>
      </div>
    </div>
  );
}
