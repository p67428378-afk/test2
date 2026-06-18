import React from "react";
import { Check, X, Pause, Play } from "lucide-react";

const BottomActionBar = ({ rule, onApprove, onReject, onPause }) => {
  if (!rule) return null;

  const isPending = rule.status === "PENDING_APPROVAL";
  const isPaused = rule.status === "PAUSED";

  return (
    <div className="fixed bottom-0 left-[260px] right-0 bg-surface-container border-t border-outline-variant p-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-on-surface">
          Selected Rule:
        </span>
        <span className="text-sm text-on-surface-variant">{rule.name}</span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            rule.status === "APPROVED" || rule.status === "ACTIVE"
              ? "bg-green-900/20 text-green-400"
              : rule.status === "PAUSED"
                ? "bg-yellow-900/20 text-yellow-400"
                : rule.status === "REJECTED"
                  ? "bg-red-900/20 text-red-400"
                  : "bg-blue-900/20 text-blue-400"
          }`}
        >
          {rule.status}
        </span>
      </div>

      <div className="flex gap-3">
        {isPending && (
          <button
            onClick={() => onPause(rule.id)}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-label-md py-2 px-4 rounded-lg transition-all flex items-center gap-1.5 text-sm"
          >
            <Pause className="w-4 h-4" />
            Pause Workflow
          </button>
        )}

        {(isPending || isPaused) && (
          <>
            <button
              onClick={() => onApprove(rule.id)}
              className="bg-green-600 hover:bg-green-500 text-white font-label-md py-2 px-4 rounded-lg transition-all flex items-center gap-1.5 text-sm"
            >
              <Check className="w-4 h-4" />
              Approve & Execute
            </button>
            <button
              onClick={() => onReject(rule.id)}
              className="bg-red-600 hover:bg-red-500 text-white font-label-md py-2 px-4 rounded-lg transition-all flex items-center gap-1.5 text-sm"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BottomActionBar;
