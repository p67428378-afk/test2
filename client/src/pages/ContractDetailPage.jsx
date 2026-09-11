import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  contractService,
  commentService,
  approvalService,
} from "../services/api";
import WorkflowStepper from "../components/WorkflowStepper";
import ApprovalActionPanel from "../components/ApprovalActionPanel";
import NegotiationDrawer from "../components/NegotiationDrawer";
import VersionDiffViewer from "../components/VersionDiffViewer";
import {
  ArrowLeft,
  Edit3,
  Save,
  History,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function ContractDetailPage() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [versions, setVersions] = useState([]);
  const [comments, setComments] = useState([]);
  const [workflowHistory, setWorkflowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [updatedTerms, setUpdatedTerms] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadAllDetails = async () => {
    setLoading(true);
    try {
      const [cData, vData, comData, hData] = await Promise.all([
        contractService.getById(id),
        contractService.getVersions(id),
        commentService.getComments(id),
        approvalService.getWorkflowHistory(id),
      ]);
      setContract(cData);
      setVersions(vData || []);
      setComments(comData || []);
      setWorkflowHistory(hData || []);
      setUpdatedTerms(cData.terms || "");
    } catch (err) {
      console.error("Failed to load contract details", err);
      setMessage({ type: "error", text: "Error loading contract details." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadAllDetails();
  }, [id]);

  const handleUpdateTerms = async (e) => {
    e.preventDefault();
    setSubmittingAction(true);
    setMessage({ type: "", text: "" });
    try {
      const updated = await contractService.update(id, {
        terms: updatedTerms,
        current_version_num: contract.version_number, // OCC check
        change_summary: changeSummary || "Terms updated by user",
      });
      setContract(updated);
      setIsEditingTerms(false);
      setChangeSummary("");
      setMessage({
        type: "success",
        text: `Contract terms updated! Version ${updated.current_version} created.`,
      });
      // Refresh versions
      const vData = await contractService.getVersions(id);
      setVersions(vData || []);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.detail ||
          "Failed to update contract terms. Conflict or validation error.",
      });
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleApprovalAction = async (actionData) => {
    setSubmittingAction(true);
    setMessage({ type: "", text: "" });
    try {
      const updated = await approvalService.submitAction(id, actionData);
      setContract(updated);
      setMessage({
        type: "success",
        text: `Stage transition '${actionData.action}' completed successfully.`,
      });
      // Refresh history & comments
      const [comData, hData] = await Promise.all([
        commentService.getComments(id),
        approvalService.getWorkflowHistory(id),
      ]);
      setComments(comData || []);
      setWorkflowHistory(hData || []);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Workflow transition failed.",
      });
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleAddComment = async (commentData) => {
    setPostingComment(true);
    try {
      await commentService.addComment(id, commentData);
      const comData = await commentService.getComments(id);
      setComments(comData || []);
      setMessage({
        type: "success",
        text: "Negotiation comment posted successfully.",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Failed to post comment.",
      });
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading contract workspace...
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-12 text-center text-slate-600">
        <p className="text-lg font-bold">Contract Not Found</p>
        <Link
          to="/"
          className="text-indigo-600 hover:underline mt-2 inline-block text-sm"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/"
            className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Contracts Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded">
              {contract.contract_number}
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              {contract.title}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Vendor:{" "}
            <span className="font-semibold text-slate-700">
              {contract.vendor?.name || "Acme Corp"}
            </span>{" "}
            | Effective: {contract.effective_date} &rarr; Expiry:{" "}
            {contract.termination_date}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Version:</span>
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold font-mono rounded-lg">
            {contract.current_version || `v${contract.version_number}.0`}
          </span>
        </div>
      </div>

      {/* Global Alert Notification */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            message.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage({ type: "", text: "" })}
            className="font-bold underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workflow Stepper Bar */}
      <WorkflowStepper currentStatus={contract.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Terms & Redline Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Contract Document & Editor */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Active Contract Terms & Clauses
                </h3>
              </div>

              {!isEditingTerms && contract.status !== "Executed" && (
                <button
                  onClick={() => setIsEditingTerms(true)}
                  className="px-3 py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Clauses (New Version)
                </button>
              )}
            </div>

            {isEditingTerms ? (
              <form onSubmit={handleUpdateTerms} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Change / Revision Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    placeholder="e.g. Revised Clause 4.2 liability limits per vendor request"
                    className="w-full text-xs border border-slate-300 rounded-md p-2 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contract Terms Text
                  </label>
                  <textarea
                    rows="8"
                    value={updatedTerms}
                    onChange={(e) => setUpdatedTerms(e.target.value)}
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTerms(false)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-600 text-xs font-semibold rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" /> Save & Bump Version
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono whitespace-pre-wrap text-slate-800 leading-relaxed max-h-60 overflow-y-auto">
                {contract.terms ||
                  "No detailed terms text uploaded for this contract."}
              </div>
            )}
          </div>

          {/* Version Redline & Comparison Component */}
          <VersionDiffViewer versions={versions} currentContract={contract} />

          {/* Threaded Negotiation Comments Drawer */}
          <NegotiationDrawer
            comments={comments}
            onAddComment={handleAddComment}
            submitting={postingComment}
            isApprovalStageLocked={[
              "Legal Review",
              "Finance Approval",
              "Pending Signature",
            ].includes(contract.status)}
          />
        </div>

        {/* Sidebar Actions & Audit History (1 Col) */}
        <div className="space-y-6">
          {/* Approval Action Panel */}
          <ApprovalActionPanel
            contract={contract}
            onSubmitAction={handleApprovalAction}
            submitting={submittingAction}
          />

          {/* Workflow Stage Audit Log */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" /> Stage Transitions
              Audit Log
            </h3>

            <div className="space-y-3">
              {workflowHistory.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No transition history logged yet.
                </p>
              ) : (
                workflowHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-indigo-700">
                        {item.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium">
                      {item.from_stage || "Draft"} &rarr;{" "}
                      {item.to_stage || item.action}
                    </div>
                    {item.remarks && (
                      <p className="text-slate-500 mt-1 italic">
                        "{item.remarks}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
