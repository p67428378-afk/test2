import React from "react";

export default function ApprovalReviewPanel({
  scenarioData,
  onSubmit,
  isSubmitting,
}) {
  if (!scenarioData) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col flex-grow justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="text-slate-400 mt-4 text-sm">
          Loading scenario details...
        </span>
      </div>
    );
  }

  const { scenario_name, sku_actions, guardrails } = scenarioData;

  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case "ADD":
        return "bg-emerald-500";
      case "REMOVE":
        return "bg-rose-500";
      case "SWAP":
        return "bg-amber-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col flex-grow">
      <h3 className="font-headline-md text-xl text-white mb-4 pb-3 border-b border-slate-700 font-bold">
        Approval Review - {scenario_name}
      </h3>

      <div className="mb-4">
        <div className="font-label-caps text-label-caps text-slate-400 mb-2 text-xs uppercase tracking-wider font-semibold">
          SKU Actions
        </div>
        <ul className="space-y-2 text-sm">
          {sku_actions && sku_actions.length > 0 ? (
            sku_actions.map((act, idx) => (
              <li key={idx} className="flex items-center gap-2 text-white">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${getActionColor(act.action)}`}
                ></span>
                <span className="font-bold text-slate-300">{act.action}:</span>{" "}
                SKU {act.sku_id}{" "}
                {act.product_name ? `(${act.product_name})` : ""}
              </li>
            ))
          ) : (
            <li className="text-slate-500 italic">
              No actions required for this scenario.
            </li>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <div className="font-label-caps text-label-caps text-slate-400 mb-2 text-xs uppercase tracking-wider font-semibold">
          Guardrails
        </div>
        <ul className="space-y-2 text-sm">
          {guardrails && guardrails.length > 0 ? (
            guardrails.map((guard, idx) => (
              <li key={idx} className="flex flex-col gap-1">
                {guard.passed ? (
                  <div className="flex items-start gap-2 text-white">
                    <span
                      className="material-symbols-outlined text-[#10b981] text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span>
                      {guard.name}{" "}
                      <span className="text-emerald-400 font-semibold">
                        ({guard.details})
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-amber-400 bg-amber-900/20 p-2 rounded border border-amber-700/30">
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      warning
                    </span>
                    <span>
                      {guard.name}{" "}
                      <span className="text-amber-300 font-semibold">
                        ({guard.details})
                      </span>
                    </span>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="text-slate-500 italic">
              No guardrail checks defined.
            </li>
          )}
        </ul>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="mt-auto w-full bg-primary hover:bg-[#d97706] disabled:bg-slate-700 disabled:text-slate-500 text-[#020617] font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 font-headline-md text-base"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#020617]"></div>
            Submitting Assortment Plan...
          </>
        ) : (
          <>
            Submit Assortment Plan
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </>
        )}
      </button>
    </div>
  );
}
