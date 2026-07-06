import React from "react";

export default function InlineConfirmation({ auditTrail, onClose }) {
  if (!auditTrail) return null;

  const formattedDate = auditTrail.timestamp
    ? new Date(auditTrail.timestamp)
        .toISOString()
        .replace("T", " ")
        .substring(0, 19) + " UTC"
    : "2026-01-09 11:50:00 UTC";

  return (
    <footer className="w-full bg-[#1E293B] border-t border-subtle p-sm shrink-0 flex items-center justify-between text-semantic-success bg-opacity-90 relative">
      <div className="flex items-center gap-sm">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <span className="font-body-sm font-semibold">
          Assortment Plan Submitted Successfully!
        </span>
      </div>
      <div className="font-data-mono text-[11px] text-on-surface-variant opacity-80 text-right flex flex-col items-end gap-1">
        <div>
          Audit Trail ID: {auditTrail.audit_trail_id} | Submitted by:{" "}
          {auditTrail.submitted_by} | Timestamp: {formattedDate}
        </div>
        <div>SKU Changes: {auditTrail.sku_changes_summary}</div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-2 text-on-surface-variant hover:text-on-surface text-xs font-bold px-1"
        title="Dismiss"
      >
        ✕
      </button>
    </footer>
  );
}
