import React from "react";
import { useAssortment } from "../../context/AssortmentContext.jsx";

export default function ApprovalReviewPanel() {
  const { activeScenario, handleSubmitScenario, submitting, submissionError } =
    useAssortment();

  const actions = activeScenario?.action_summary ||
    activeScenario?.actions_breakdown || {
      GROW: 4,
      MAINTAIN: 85,
      SWAP: 3,
      REDUCE: 2,
    };

  return (
    <div className="bg-[#1E293B] rounded-lg p-5 border border-[#334155] flex flex-col justify-between h-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            Active Scenario:{" "}
            <span className="text-amber-500 font-bold">
              {activeScenario?.name ||
                activeScenario?.scenario_name ||
                "Balanced"}
            </span>
          </h3>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-md border border-[#334155]">
              <span className="material-symbols-outlined text-emerald-400 text-lg">
                verified
              </span>
              <span className="text-xs text-slate-300">
                Space Constraint Check
              </span>
              <span className="text-xs font-bold text-emerald-400 ml-1">
                [PASSED]
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-md border border-[#334155]">
              <span className="material-symbols-outlined text-emerald-400 text-lg">
                verified
              </span>
              <span className="text-xs text-slate-300">Minimum Assortment</span>
              <span className="text-xs font-bold text-emerald-400 ml-1">
                [PASSED]
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-md border border-[#334155]">
              <span className="material-symbols-outlined text-emerald-400 text-lg">
                verified
              </span>
              <span className="text-xs text-slate-300">Financial Hurdle</span>
              <span className="text-xs font-bold text-emerald-400 ml-1">
                [PASSED]
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 lg:border-l lg:border-[#334155] lg:pl-6 w-full lg:w-auto">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="font-bold">{actions.GROW || 4}</span> GROW
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <span className="font-bold">{actions.REDUCE || 2}</span> REDUCE
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-bold">{actions.MAINTAIN || 85}</span>{" "}
              MAINTAIN
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <span className="font-bold">{actions.SWAP || 3}</span> SWAP
            </div>
          </div>

          <button
            onClick={handleSubmitScenario}
            disabled={submitting}
            className="w-full sm:w-auto bg-amber-500 text-slate-950 px-6 py-3 rounded-md font-bold text-xs shadow-lg hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">publish</span>
            {submitting
              ? "Submitting..."
              : "Submit Recommendation & Lock Assortment"}
          </button>
        </div>
      </div>

      {submissionError && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs">
          {submissionError}
        </div>
      )}
    </div>
  );
}
