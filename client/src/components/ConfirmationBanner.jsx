import React from "react";
import { useAssortment } from "../context/AssortmentContext";

const ConfirmationBanner = () => {
  const { submissionResult, setSubmissionResult } = useAssortment();

  if (!submissionResult) return null;

  const auditRef = submissionResult.audit_ref_id || "AUD-994821";
  const status = submissionResult.status || "APPROVED_AND_LOGGED";
  const scenario = submissionResult.scenario_name || "Balanced";
  const timestamp = submissionResult.submitted_at || new Date().toISOString();
  const totalModified = submissionResult.total_skus_modified || 17;

  return (
    <div className="bg-[#064E3B] border border-[#10B981]/40 rounded-lg p-4 flex items-start gap-4 shadow-lg animate-fadeIn">
      <div className="text-[#10B981] font-bold text-xl mt-0.5">✓</div>

      <div className="flex-1">
        <h3 className="text-base font-bold text-white mb-1">
          Assortment Recommendation Submitted & Locked!
        </h3>
        <p className="text-xs text-emerald-100/90 font-mono leading-relaxed">
          Audit Ref ID: <span className="font-bold text-white">{auditRef}</span>{" "}
          | Status: <span className="font-bold text-white">{status}</span> |
          Submitted by: <span className="font-bold text-white">USR-CM-882</span>{" "}
          | Scenario: <span className="font-bold text-white">{scenario}</span> (
          {totalModified} SKUs updated) | Timestamp:{" "}
          <span className="text-white">{timestamp}</span>
        </p>
      </div>

      <button
        onClick={() => setSubmissionResult(null)}
        className="text-emerald-200 hover:text-white transition-colors cursor-pointer text-sm font-bold px-2 py-1"
        title="Dismiss Confirmation"
      >
        ✕
      </button>
    </div>
  );
};

export default ConfirmationBanner;
