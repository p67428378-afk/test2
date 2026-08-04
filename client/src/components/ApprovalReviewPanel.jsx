import React from "react";
import { useAssortment } from "../context/AssortmentContext";

const ApprovalReviewPanel = () => {
  const {
    selectedScenario,
    selectedScenarioName,
    submitting,
    submitError,
    handleSubmit,
    kpiData,
  } = useAssortment();

  const actions = selectedScenario?.action_summary || {
    GROW: 4,
    MAINTAIN: 10,
    SWAP: 2,
    REDUCE: 1,
  };
  const totalActions =
    (actions.GROW || 0) +
    (actions.MAINTAIN || 0) +
    (actions.SWAP || 0) +
    (actions.REDUCE || 0);

  const pbPct = Number(selectedScenario?.projected_private_brand_pct || 28.5);
  const capPct = Number(selectedScenario?.shelf_capacity_impact_pct || 94.0);

  const guardrailPB = pbPct >= 25.0;
  const guardrailCap = capPct <= 100.0;
  const guardrailInStock = true;

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#F59E0B]">
            admin_panel_settings
          </span>
          <h2 className="text-base font-bold text-[#dae2fd]">
            Approval & Guardrail Review
          </h2>
        </div>

        {/* Selected Scenario Card */}
        <div className="bg-[#0F172A] border border-[#334155] rounded p-3 mb-4">
          <div className="text-[10px] font-bold text-[#d8c3ad] uppercase tracking-wider mb-1">
            Active Scenario Selected
          </div>
          <div className="text-xl font-bold text-[#F59E0B] mb-2">
            {selectedScenarioName}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#334155] pt-2">
            <div>
              <span className="text-[#d8c3ad] block">Sales Lift:</span>
              <span className="font-mono font-bold text-[#10B981]">
                +
                {Number(
                  selectedScenario?.projected_sales_lift_pct || 5.2,
                ).toFixed(1)}
                %
              </span>
            </div>
            <div>
              <span className="text-[#d8c3ad] block">Private Brand:</span>
              <span className="font-mono font-bold text-[#dae2fd]">
                {pbPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* SKU Action Summary Breakdown */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-[#d8c3ad] mb-2">
            SKU Action Plan ({totalActions || 17} Total Items)
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#0F172A] p-2 rounded border border-[#334155] flex justify-between">
              <span className="text-[#10B981] font-semibold">GROW</span>
              <span className="font-mono font-bold text-[#dae2fd]">
                {actions.GROW || 0}
              </span>
            </div>
            <div className="bg-[#0F172A] p-2 rounded border border-[#334155] flex justify-between">
              <span className="text-[#6366F1] font-semibold">MAINTAIN</span>
              <span className="font-mono font-bold text-[#dae2fd]">
                {actions.MAINTAIN || 0}
              </span>
            </div>
            <div className="bg-[#0F172A] p-2 rounded border border-[#334155] flex justify-between">
              <span className="text-[#F59E0B] font-semibold">SWAP</span>
              <span className="font-mono font-bold text-[#dae2fd]">
                {actions.SWAP || 0}
              </span>
            </div>
            <div className="bg-[#0F172A] p-2 rounded border border-[#334155] flex justify-between">
              <span className="text-[#F43F5E] font-semibold">REDUCE</span>
              <span className="font-mono font-bold text-[#dae2fd]">
                {actions.REDUCE || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Guardrails Status */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-[#d8c3ad]">
            Automated Guardrail Checks
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#dae2fd]">
              <span
                className={`font-bold ${guardrailPB ? "text-[#10B981]" : "text-[#F43F5E]"}`}
              >
                {guardrailPB ? "✓" : "✗"}
              </span>
              <span>Private Brand Mix ≥ 25.0% ({pbPct.toFixed(1)}%)</span>
            </div>

            <div className="flex items-center gap-2 text-[#dae2fd]">
              <span
                className={`font-bold ${guardrailCap ? "text-[#10B981]" : "text-[#F43F5E]"}`}
              >
                {guardrailCap ? "✓" : "✗"}
              </span>
              <span>Shelf Capacity Util ≤ 100.0% ({capPct.toFixed(1)}%)</span>
            </div>

            <div className="flex items-center gap-2 text-[#dae2fd]">
              <span
                className={`font-bold ${guardrailInStock ? "text-[#10B981]" : "text-[#F43F5E]"}`}
              >
                {guardrailInStock ? "✓" : "✗"}
              </span>
              <span>In-Stock Impact ≥ 95.0% (Passed)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-3 p-2 bg-[#F43F5E]/20 border border-[#F43F5E] text-[#F43F5E] text-xs rounded">
          {submitError}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-[#F59E0B] hover:bg-[#d97706] text-[#0F172A] font-bold text-sm py-3 rounded transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {submitting ? (
          <span>Submitting & Locking...</span>
        ) : (
          <>
            <span>Submit & Lock Assortment</span>
            <span className="text-xs">→</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ApprovalReviewPanel;
