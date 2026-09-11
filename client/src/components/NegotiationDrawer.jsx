import React, { useState } from "react";
import { MessageSquare, Lock, Globe, Send, ShieldAlert } from "lucide-react";

export default function NegotiationDrawer({
  comments = [],
  onAddComment,
  submitting,
  isApprovalStageLocked = false,
}) {
  const [commentText, setCommentText] = useState("");
  const [clauseRef, setClauseRef] = useState("Clause 4.2 - Liability Cap");
  const [isInternalOnly, setIsInternalOnly] = useState(false);
  const [filterVisibility, setFilterVisibility] = useState("ALL");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment({
      clause_reference: clauseRef,
      comment_text: commentText,
      content: commentText,
      is_internal_only: isInternalOnly,
    });
    setCommentText("");
  };

  const filteredComments = comments.filter((c) => {
    if (filterVisibility === "PUBLIC") return !c.is_internal_only;
    if (filterVisibility === "INTERNAL") return c.is_internal_only;
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Negotiation Comments & Collaboration
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter:</span>
          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value)}
            className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white"
          >
            <option value="ALL">All Visibility</option>
            <option value="PUBLIC">Public Only</option>
            <option value="INTERNAL">Internal Only 🔒</option>
          </select>
        </div>
      </div>

      {/* Lock Notice if under active approval */}
      {isApprovalStageLocked && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Audit Compliance Active:</strong> Comments created during
            active approval stages are immutable and locked against deletion.
          </span>
        </div>
      )}

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clause Reference
            </label>
            <input
              type="text"
              value={clauseRef}
              onChange={(e) => setClauseRef(e.target.value)}
              placeholder="e.g. Clause 4.2 - Liability Cap"
              className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={isInternalOnly}
                onChange={(e) => setIsInternalOnly(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1 font-semibold text-amber-800">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Internal-Only Comment (Hidden from Vendor)
              </span>
            </label>
          </div>
        </div>

        <div>
          <textarea
            rows="2"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type negotiation comment or requested clause modification..."
            className="w-full text-sm border border-slate-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-md shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {filteredComments.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No negotiation comments recorded yet.
          </p>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3.5 rounded-lg border text-sm transition-all ${
                comment.is_internal_only
                  ? "bg-amber-50 border-amber-200"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">
                    {comment.user_name || comment.user_email || "User"}
                  </span>
                  {comment.is_internal_only ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Internal Only
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Public
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>

              {comment.clause_reference && (
                <div className="text-xs font-semibold text-indigo-700 mb-1">
                  {comment.clause_reference}
                </div>
              )}

              <p className="text-slate-800 text-xs leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
