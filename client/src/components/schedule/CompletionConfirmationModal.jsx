import React from "react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function CompletionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isCompleted,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg ${isCompleted ? "bg-amber-500/10 text-amber-400" : "bg-indigo-500/10 text-indigo-400"}`}
            >
              {isCompleted ? (
                <AlertTriangle size={24} />
              ) : (
                <CheckCircle size={24} />
              )}
            </div>
            <h3 className="text-lg font-semibold text-[#F8FAFC]">
              {isCompleted ? "Revert Completion" : "Confirm Completion"}
            </h3>
          </div>

          <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
            {isCompleted
              ? "Are you sure you want to mark this slot as active again?"
              : "Are you sure you want to mark this slot as complete?"}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                isCompleted
                  ? "bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
