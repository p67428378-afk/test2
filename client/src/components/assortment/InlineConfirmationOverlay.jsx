import React from "react";
import { CheckCircle2, X, Calendar, Mail, Hash, FileText } from "lucide-react";

export default function InlineConfirmationOverlay({ confirmation, onClose }) {
  if (!confirmation) return null;

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-primary/5 p-6 border-b border-outline-variant/20 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">
                Submission Successful
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Assortment plan has been locked and logged.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Hash className="w-4 h-4 text-primary" />
              <span className="font-semibold">Submission ID:</span>
              <span className="font-mono text-on-surface ml-auto">
                {confirmation.submission_id}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Mail className="w-4 h-4 text-primary" />
              <span className="font-semibold">Manager Email:</span>
              <span className="text-on-surface ml-auto">
                {confirmation.manager_email}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-semibold">Timestamp:</span>
              <span className="text-on-surface ml-auto">
                {new Date(confirmation.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-primary" /> Audit Trail
              Summary
            </span>
            <p className="text-xs text-on-surface-variant bg-surface-container-low/30 p-4 rounded-xl border border-outline-variant/10 leading-relaxed font-medium">
              {confirmation.audit_trail_summary}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container-low/50 px-6 py-4 border-t border-outline-variant/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
