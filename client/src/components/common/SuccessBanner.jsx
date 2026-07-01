import React from "react";
import { CheckCircle2, X } from "lucide-react";

export default function SuccessBanner({
  summary,
  auditId,
  submittedAt,
  onClose,
}) {
  return (
    <div className="bg-tertiary/10 border border-tertiary/30 rounded-xl p-6 relative shadow-sm animate-fadeIn">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-start gap-4">
        <div className="bg-tertiary/20 p-2 rounded-full text-tertiary shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-headline-sm font-bold text-tertiary">
            Assortment Plan Submitted Successfully
          </h3>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            {summary ||
              "Success! Assortment plan for Small Town Value Cluster submitted."}
          </p>

          <div className="pt-2 flex flex-wrap gap-x-6 gap-y-1 text-body-sm text-secondary border-t border-outline-variant/30 mt-4">
            <div>
              <span className="font-semibold text-on-surface-variant">
                Audit ID:
              </span>{" "}
              <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs font-mono">
                {auditId || "N/A"}
              </code>
            </div>
            <div>
              <span className="font-semibold text-on-surface-variant">
                Submitted At:
              </span>{" "}
              {submittedAt ? new Date(submittedAt).toLocaleString() : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
