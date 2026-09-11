import React, { useState } from "react";
import { CheckCircle2, XCircle, Send, AlertCircle } from "lucide-react";

export default function ApprovalActionPanel({
  contract,
  userRole,
  onSubmitAction,
  submitting,
}) {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  const currentStatus = contract?.status;

  // Determine allowed actions based on current status & user role
  const canApprove = () => {
    if (currentStatus === "Draft") return true; // Procurement Admin or any authorized user can SUBMIT
    if (currentStatus === "Legal Review") return true; // Legal Approver
    if (currentStatus === "Finance Approval") return true; // Finance Approver
    if (currentStatus === "Pending Signature") return true; // Final sign-off
    return false;
  };

  const getTargetApprovalAction = () => {
    if (currentStatus === "Draft")
      return {
        action: "SUBMIT",
        label: "Submit for Legal Review",
        color: "indigo",
      };
    if (currentStatus === "Legal Review")
      return {
        action: "APPROVE",
        label: "Approve & Pass to Finance",
        color: "indigo",
      };
    if (currentStatus === "Finance Approval")
      return {
        action: "APPROVE",
        label: "Approve & Pass to Signature",
        color: "indigo",
      };
    if (currentStatus === "Pending Signature")
      return { action: "EXECUTE", label: "Execute Contract", color: "emerald" };
    return null;
  };

  const handleAction = (actionType) => {
    if (actionType === "REJECT" && !remarks.trim()) {
      setError(
        "Rejection remarks/comments are mandatory for audit compliance.",
      );
      return;
    }
    setError("");
    onSubmitAction({
      action: actionType,
      comments: remarks,
    });
    setRemarks("");
  };

  const nextAction = getTargetApprovalAction();

  if (currentStatus === "Executed" || currentStatus === "Expired") {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-center text-slate-600">
        <p className="text-sm font-semibold">
          Contract is in final state:{" "}
          <span className="font-bold text-slate-800">{currentStatus}</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">
          No further stage approvals required.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
        Approval Action Panel
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Audit Remarks / Approval Comments
          </label>
          <textarea
            rows="3"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add mandatory notes, compliance observations, or rejection grounds..."
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {/* Quick template chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              onClick={() =>
                setRemarks("Terms reviewed and compliant with legal standards.")
              }
              className="cursor-pointer text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
            >
              + Legal Compliant
            </span>
            <span
              onClick={() =>
                setRemarks(
                  "Financial budget verified and liability limits accepted.",
                )
              }
              className="cursor-pointer text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
            >
              + Finance Verified
            </span>
            <span
              onClick={() =>
                setRemarks(
                  "Liability cap exceeds organizational threshold. Please revise.",
                )
              }
              className="cursor-pointer text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
            >
              + Revise Liability Cap
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          {nextAction && (
            <button
              onClick={() => handleAction(nextAction.action)}
              disabled={submitting}
              className={`px-5 py-2.5 bg-${nextAction.color === "emerald" ? "emerald" : "indigo"}-600 hover:bg-${
                nextAction.color === "emerald" ? "emerald" : "indigo"
              }-700 text-white font-medium text-sm rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? "Processing..." : nextAction.label}
            </button>
          )}

          {currentStatus !== "Draft" && (
            <button
              onClick={() => handleAction("REJECT")}
              disabled={submitting}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              {submitting ? "Processing..." : "Reject to Draft"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
