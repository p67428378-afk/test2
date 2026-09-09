import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmationModal({
  routineTitle,
  onConfirm,
  onCancel,
  deleting,
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      data-testid="delete-confirmation-modal"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold font-serif text-slate-900">
            Delete Routine?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              "{routineTitle}"
            </span>
            ? This action is permanent and cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <span>{deleting ? "Deleting..." : "Delete Routine"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
