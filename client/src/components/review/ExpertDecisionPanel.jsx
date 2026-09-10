import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export function ExpertDecisionPanel({
  note,
  onApprove,
  onReject,
  isSubmitting = false,
}) {
  const [feedback, setFeedback] = useState("");
  const [checklist, setChecklist] = useState({
    technicalAccuracy: true,
    citationsValid: true,
    noConfidentialData: true,
  });
  const [error, setError] = useState("");

  if (!note) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-xs">
        Select a pending research note from the queue to perform SME expert
        review.
      </div>
    );
  }

  const handleApprove = async () => {
    setError("");
    try {
      await onApprove(note.id, {
        action: "APPROVE",
        feedback: feedback || "Approved - valuable insights for knowledge base",
      });
      setFeedback("");
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "Failed to approve note",
      );
    }
  };

  const handleReject = async () => {
    setError("");
    if (!feedback.trim()) {
      setError(
        "Mandatory feedback is required when rejecting a research note.",
      );
      return;
    }

    try {
      await onReject(note.id, {
        action: "REJECT",
        feedback: feedback.trim(),
      });
      setFeedback("");
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || "Failed to reject note",
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>SME Expert Decision Panel</span>
      </div>

      <div className="space-y-2 text-xs">
        <p className="font-semibold text-slate-700">
          Expert Pre-Validation Checklist:
        </p>
        <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.technicalAccuracy}
              onChange={(e) =>
                setChecklist({
                  ...checklist,
                  technicalAccuracy: e.target.checked,
                })
              }
              className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
            />
            <span className="text-slate-700">
              Technical accuracy and findings verified
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.citationsValid}
              onChange={(e) =>
                setChecklist({ ...checklist, citationsValid: e.target.checked })
              }
              className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
            />
            <span className="text-slate-700">
              Citations and reference links verified
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.noConfidentialData}
              onChange={(e) =>
                setChecklist({
                  ...checklist,
                  noConfidentialData: e.target.checked,
                })
              }
              className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
            />
            <span className="text-slate-700">
              Complies with internal knowledge sharing policies
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center space-x-1">
            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
            <span>Review Feedback / Decision Rationale</span>
          </span>
          <span className="text-[10px] text-amber-600 font-normal">
            *Mandatory if rejecting
          </span>
        </label>
        <textarea
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback for author (e.g., Approved - valuable insights, OR explain why rejected)..."
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleReject}
          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          <span>Reject Note</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleApprove}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition shadow disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Approve to Knowledge Base</span>
        </button>
      </div>
    </div>
  );
}

export default ExpertDecisionPanel;
