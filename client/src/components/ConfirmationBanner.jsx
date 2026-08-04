import React from "react";
import { useAssortment } from "../context/AssortmentContext.jsx";

export default function ConfirmationBanner() {
  const { submissionResult, handleDismissConfirmation } = useAssortment();

  if (!submissionResult) return null;

  return (
    <div className="bg-[#064E3B] border border-emerald-500/30 rounded-lg p-4 flex items-start gap-4 shadow-lg transition-all">
      <span className="material-symbols-outlined text-emerald-400 text-2xl mt-0.5">
        check_circle
      </span>
      <div className="flex-1">
        <h3 className="font-title-lg text-white font-bold text-base mb-1">
          Assortment Recommendation Submitted & Locked!
        </h3>
        <p className="font-body-sm text-emerald-100/90 text-xs font-mono leading-relaxed">
          Audit Ref ID: {submissionResult.audit_ref_id || "AUD-994821"} |
          Status: {submissionResult.status || "APPROVED_AND_LOGGED"} | Submitted
          by: USR-CM-882 | Timestamp:{" "}
          {submissionResult.submitted_at || new Date().toISOString()} |
          Scenario: {submissionResult.scenario_name || "Balanced"} (
          {submissionResult.total_skus_modified || 17} SKUs updated)
        </p>
      </div>
      <button
        onClick={handleDismissConfirmation}
        className="text-emerald-200 hover:text-white transition-colors"
        aria-label="Close"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}
