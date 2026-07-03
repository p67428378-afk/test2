import React from "react";

export default function SuccessBanner({ auditTrail, onClose }) {
  if (!auditTrail) return null;

  return (
    <div className="glass-success rounded-lg p-4 flex items-start justify-between transition-all duration-300 animate-fadeIn">
      <div className="flex items-center gap-3 text-white">
        <span
          className="material-symbols-outlined text-[#10b981]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <div>
          <span className="font-semibold block text-emerald-400">Success!</span>
          <span className="text-sm text-gray-200">
            Assortment plan for Small Town Value Cluster submitted on{" "}
            {new Date(auditTrail.submitted_at).toLocaleString()}. Audit Trail
            ID:{" "}
            <span className="font-mono text-emerald-300">
              {auditTrail.audit_trail_id}
            </span>
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-300 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
