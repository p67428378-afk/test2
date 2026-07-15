import React, { useState } from "react";
import { loanService } from "../../services/api";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertCircle,
  Gift,
} from "lucide-react";

export default function EvaluationPanel({
  application,
  officerEmail,
  onDecisionSubmitted,
  onCancel,
}) {
  const [decision, setDecision] = useState("Approved");
  const [remarks, setRemarks] = useState("");
  const [offeredAmount, setOfferedAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (decision !== "Make Offer" && !remarks.trim()) {
      setError("Remarks are mandatory for decisions.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (decision === "Make Offer") {
        const amt = parseFloat(offeredAmount);
        if (isNaN(amt) || amt <= 0) {
          setError("Please enter a valid offered amount.");
          setSubmitting(false);
          return;
        }
        if (amt > parseFloat(application.requested_amount)) {
          setError("Offered amount cannot exceed requested amount.");
          setSubmitting(false);
          return;
        }
        await loanService.createOffer(
          application.application_id,
          officerEmail,
          { offered_amount: amt },
        );
      } else {
        await loanService.submitDecision(
          application.application_id,
          officerEmail,
          {
            decision,
            remarks,
          },
        );
      }
      onDecisionSubmitted();
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to submit action.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const isApproved = application.status === "Approved";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <ShieldAlert className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Evaluate Application
        </h2>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm space-y-2 border border-slate-100">
        <div className="flex justify-between">
          <span className="text-slate-500">Applicant ID:</span>
          <span className="font-mono text-xs text-slate-700">
            {application.application_id}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Product:</span>
          <span className="font-semibold text-slate-800">
            {application.product_name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Requested Amount:</span>
          <span className="font-bold text-slate-800">
            ${parseFloat(application.requested_amount).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Current Status:</span>
          <span className="font-medium text-indigo-600">
            {application.status}
          </span>
        </div>
        {application.offer_status && (
          <div className="flex justify-between">
            <span className="text-slate-500">Offer Status:</span>
            <span className="font-medium text-purple-600">
              {application.offer_status}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Action
          </label>
          <div className="grid grid-cols-3 gap-2">
            {!isApproved && (
              <>
                <button
                  type="button"
                  onClick={() => setDecision("Approved")}
                  className={`flex items-center justify-center gap-1 py-3 px-2 rounded-lg border text-xs font-medium transition-all ${
                    decision === "Approved"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setDecision("Rejected")}
                  className={`flex items-center justify-center gap-1 py-3 px-2 rounded-lg border text-xs font-medium transition-all ${
                    decision === "Rejected"
                      ? "bg-red-50 border-red-500 text-red-700 ring-2 ring-red-500/20"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
              </>
            )}
            {isApproved && (
              <button
                type="button"
                onClick={() => setDecision("Make Offer")}
                className={`col-span-3 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                  decision === "Make Offer"
                    ? "bg-purple-50 border-purple-500 text-purple-700 ring-2 ring-purple-500/20"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Gift className="w-4 h-4" />
                Make Offer
              </button>
            )}
          </div>
        </div>

        {decision === "Make Offer" ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Offered Amount ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={offeredAmount}
              onChange={(e) => setOfferedAmount(e.target.value)}
              max={application.requested_amount}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Max: $${parseFloat(application.requested_amount).toLocaleString()}`}
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows="4"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Provide detailed remarks for this decision..."
            ></textarea>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              decision === "Approved"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : decision === "Make Offer"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Action"}
          </button>
        </div>
      </form>
    </div>
  );
}
