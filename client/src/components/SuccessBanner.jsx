import React from "react";
import PropTypes from "prop-types";

export default function SuccessBanner({ auditTrail, onClose }) {
  if (!auditTrail) return null;

  return (
    <div className="bg-[#059669]/10 border border-[#059669]/30 rounded-xl p-6 mb-6 relative animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
      <div className="flex items-start space-x-4">
        <div className="bg-[#059669]/20 p-2 rounded-full text-[#34D399]">
          <span className="material-symbols-outlined text-[24px]">
            check_circle
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#34D399] mb-1">
            Scenario Submitted Successfully
          </h3>
          <p className="text-sm text-[#CBD5E1] mb-4">
            The strategic scenario has been submitted to the regional/zonal
            head. An audit trail has been generated for regulatory traceability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0F172A]/50 p-4 rounded-lg border border-subtle font-mono-data text-xs text-[#E2E8F0]">
            <div>
              <span className="text-muted block mb-1 uppercase tracking-wider text-[10px]">
                Approved By
              </span>
              <span className="font-semibold text-white">
                {auditTrail.approved_by}
              </span>
            </div>
            <div>
              <span className="text-muted block mb-1 uppercase tracking-wider text-[10px]">
                Timestamp
              </span>
              <span className="font-semibold text-white">
                {new Date(auditTrail.timestamp).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted block mb-1 uppercase tracking-wider text-[10px]">
                Guardrails Passed
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {auditTrail.guardrails_passed?.map((g, idx) => (
                  <span
                    key={idx}
                    className="bg-[#059669]/20 text-[#34D399] px-1.5 py-0.5 rounded text-[10px] font-semibold"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SuccessBanner.propTypes = {
  auditTrail: PropTypes.shape({
    approved_by: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    guardrails_passed: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};
