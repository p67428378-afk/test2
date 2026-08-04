import React from "react";
import { useAssortment } from "../../context/AssortmentContext.jsx";

export default function ConfirmationBanner() {
  const { submissionResult, handleDismissConfirmation } = useAssortment();

  if (!submissionResult) return null;

  const auditRef = submissionResult.audit_ref_id || "AUD-994821";
  const scenario =
    submissionResult.scenario_name ||
    submissionResult.selected_scenario ||
    "Balanced";
  const skusCount =
    submissionResult.skus_modified_count ||
    submissionResult.total_skus_modified ||
    17;

  return (
    <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-lg p-4 flex items-center justify-between shadow-lg transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-emerald-400 text-xl">
            task_alt
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-50">
            Assortment Recommendation Approved & Logged ({scenario} Scenario -{" "}
            {skusCount} SKUs updated)
          </p>
          <p className="text-xs text-emerald-200/70">
            Changes queued for Planogram execution team. Logged by USR-CM-882.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <span className="text-[10px] text-emerald-200/70 block uppercase font-semibold">
            Reference ID
          </span>
          <span className="font-mono text-xs font-bold text-emerald-400">
            {auditRef}
          </span>
        </div>
        <button
          onClick={handleDismissConfirmation}
          className="text-emerald-200 hover:text-white transition-colors p-1"
          aria-label="Dismiss banner"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
}
