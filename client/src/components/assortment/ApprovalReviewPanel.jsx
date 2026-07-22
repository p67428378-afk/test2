import React from "react";

export default function ApprovalReviewPanel({
  selectedScenario,
  projection,
  onSubmit,
  submitting,
}) {
  const scenarioNameFormatted = selectedScenario
    ? selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)
    : "Balanced";

  const actions = projection?.actions || {
    add: [{ sku_id: "1", sku_name: "Clover Valley Potato Chips" }],
    reduce: [{ sku_id: "2", sku_name: "Pretzels Rold Gold" }],
    swap: [{ sku_id: "3", sku_name: "Fritos Original" }],
  };

  const guardrails = projection?.guardrails || [
    { name: "Projected Private Brand % > 15%", pass: true },
    { name: "Shelf Capacity < 95%", pass: true },
  ];

  const formatActionList = (list) => {
    if (!list || list.length === 0) return "None";
    return list.map((item) => item.sku_name).join(", ");
  };

  return (
    <div className="surface-l1 rounded-xl p-4 flex flex-col flex-1 border-t-4 border-t-[#10B981]">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[#10B981]">
          fact_check
        </span>
        <h2 className="text-lg font-semibold text-white leading-tight">
          Approval Review
          <br />
          <span className="text-xs font-normal text-slate-400">
            {scenarioNameFormatted} Scenario
          </span>
        </h2>
      </div>

      <div className="bg-[#0F172A] rounded-lg p-3 mb-4 border border-[#334155]">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Action Summary
        </h4>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center border-b border-[#1E293B] pb-1">
            <span className="text-emerald-400 font-medium">Add:</span>
            <span
              className="text-slate-300 truncate max-w-[180px] text-right"
              title={formatActionList(actions.add)}
            >
              {actions.add?.length || 0} SKU(s) ({formatActionList(actions.add)}
              )
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-[#1E293B] pb-1">
            <span className="text-amber-400 font-medium">Swap:</span>
            <span
              className="text-slate-300 truncate max-w-[180px] text-right"
              title={formatActionList(actions.swap)}
            >
              {formatActionList(actions.swap)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-rose-400 font-medium">Reduce:</span>
            <span
              className="text-slate-300 truncate max-w-[180px] text-right"
              title={formatActionList(actions.reduce)}
            >
              {formatActionList(actions.reduce)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Guardrail Checks
        </h4>
        <div className="flex flex-col gap-2">
          {guardrails.map((gr, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-slate-300 text-xs bg-slate-800/50 p-2 rounded"
            >
              <span
                className={`material-symbols-outlined text-[16px] ${gr.pass ? "text-[#10B981]" : "text-rose-500"}`}
              >
                {gr.pass ? "check_circle" : "cancel"}
              </span>
              {gr.name}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-[#10B981] hover:bg-emerald-600 disabled:bg-slate-700 text-white text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined">send</span>
          {submitting ? "Submitting Plan..." : "Submit Assortment Plan"}
        </button>
      </div>
    </div>
  );
}
