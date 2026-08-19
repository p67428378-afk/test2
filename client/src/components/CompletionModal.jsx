import React, { useState } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";

export default function CompletionModal({
  task,
  isOpen,
  onClose,
  onConfirm,
  submitting = false,
}) {
  if (!isOpen || !task) return null;

  const [actualCost, setActualCost] = useState(
    task.actual_cost !== undefined && task.actual_cost !== null
      ? task.actual_cost
      : task.estimated_cost || "",
  );
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (actualCost === "" || Number(actualCost) < 0) {
      setError("Please provide a valid non-negative actual cost.");
      return;
    }
    if (!resolutionNotes.trim()) {
      setError("Resolution notes are required for completing a task.");
      return;
    }

    onConfirm({
      actual_cost: parseFloat(actualCost),
      resolution_notes: resolutionNotes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#e3e8f0] relative animate-in fade-in zoom-in duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#707a8c] hover:text-[#171c29] p-1 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#171c29]">
              Complete Maintenance Task
            </h3>
            <p className="text-xs text-[#707a8c]">{task.title}</p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="actual_cost"
              className="block text-sm font-semibold text-[#171c29] mb-1"
            >
              Final Actual Cost ($) <span className="text-red-500">*</span>
            </label>
            <input
              id="actual_cost"
              type="number"
              step="0.01"
              min="0"
              value={actualCost}
              onChange={(e) => {
                setActualCost(e.target.value);
                setError("");
              }}
              placeholder="e.g. 450.00"
              className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
              required
            />
            <p className="text-xs text-[#707a8c] mt-1">
              Estimated cost was: ${task.estimated_cost?.toFixed(2)}
            </p>
          </div>

          <div>
            <label
              htmlFor="resolution_notes"
              className="block text-sm font-semibold text-[#171c29] mb-1"
            >
              Resolution Summary / Maintenance Notes{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="resolution_notes"
              rows="4"
              value={resolutionNotes}
              onChange={(e) => {
                setResolutionNotes(e.target.value);
                setError("");
              }}
              placeholder="Describe work completed, parts replaced, and inspection observations..."
              className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#e3e8f0] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#707a8c] hover:text-[#171c29] hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? "Updating..." : "Mark as Completed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
