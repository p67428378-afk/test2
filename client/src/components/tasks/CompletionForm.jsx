import React, { useState, useEffect } from "react";
import { CheckCircle2, DollarSign, FileText, Calendar } from "lucide-react";
import Button from "../common/Button";

export default function CompletionForm({ task, onSubmit, onCancel }) {
  const [actualCost, setActualCost] = useState(
    task?.estimated_cost !== undefined ? task.estimated_cost : 0,
  );
  const [notes, setNotes] = useState("");
  const [receiptReference, setReceiptReference] = useState("");
  const [completedAt, setCompletedAt] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setActualCost(task.estimated_cost ?? 0);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actualCost !== "" && Number(actualCost) < 0) {
      setError("Actual cost cannot be negative");
      return;
    }
    setError("");

    onSubmit({
      completed_at: completedAt
        ? new Date(completedAt).toISOString()
        : new Date().toISOString(),
      actual_cost:
        actualCost === ""
          ? Number(task?.estimated_cost || 0)
          : Number(actualCost),
      notes: notes.trim() || undefined,
      receipt_reference: receiptReference.trim() || undefined,
    });
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-2 text-[#17a34a] mb-4">
        <CheckCircle2 className="w-5 h-5" />
        <h3 className="text-base font-bold text-[#171c29]">Log Completion</h3>
      </div>

      {task && (
        <div className="mb-4 bg-[#f7fafc] p-3 rounded-lg border border-[#e3e8f0] text-xs space-y-1">
          <p className="font-semibold text-[#171c29]">{task.title}</p>
          <p className="text-[#707a8c]">
            Est. Cost: ${task.estimated_cost?.toFixed(2) || "0.00"} | Frequency:{" "}
            {task.frequency}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Completion Date Time */}
        <div>
          <label className="block text-xs font-semibold text-[#171c29] mb-1">
            Completion Date & Time
          </label>
          <input
            type="datetime-local"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        {/* Actual Cost */}
        <div>
          <label className="block text-xs font-semibold text-[#171c29] mb-1">
            Actual Cost ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder={`Default: $${task?.estimated_cost || 0}`}
            value={actualCost}
            onChange={(e) => setActualCost(e.target.value)}
            className={`w-full px-3 py-2 text-sm bg-[#f2f5fa] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb] ${
              error ? "border-red-500" : "border-[#e3e8f0]"
            }`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Receipt Reference */}
        <div>
          <label className="block text-xs font-semibold text-[#171c29] mb-1">
            Receipt Reference / Invoice #
          </label>
          <input
            type="text"
            placeholder="e.g. REC-2026-0042"
            value={receiptReference}
            onChange={(e) => setReceiptReference(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#171c29] mb-1">
            Notes & Details
          </label>
          <textarea
            rows={3}
            placeholder="Replaced filter with MERV 11 rated filter..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="accent">
            Submit Completion
          </Button>
        </div>
      </form>
    </div>
  );
}
