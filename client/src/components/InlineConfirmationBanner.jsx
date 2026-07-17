import React from "react";

export default function InlineConfirmationBanner({ auditTrail, onClose }) {
  if (!auditTrail) return null;

  return (
    <div className="bg-primary-container/10 border border-primary-container/30 rounded-lg p-4 flex items-start gap-3 w-full animate-fade-in-down">
      <span className="material-symbols-outlined text-primary-container mt-0.5">
        check_circle
      </span>
      <div className="flex-1">
        <p className="font-body-md text-body-md text-on-surface">
          Assortment plan submitted successfully!
          <span className="text-on-surface-variant font-label-sm text-label-sm ml-2 px-2 py-0.5 bg-surface-container-high rounded border border-outline-variant">
            Audit ID: {auditTrail.audit_id}
          </span>
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Category manager: {auditTrail.manager_name}. Submitted at:{" "}
          {new Date(auditTrail.submitted_at).toLocaleString()}.
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-on-surface-variant hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
