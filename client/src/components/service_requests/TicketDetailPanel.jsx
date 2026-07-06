import React, { useState } from "react";
import {
  X,
  MessageSquare,
  CheckCircle,
  Play,
  AlertTriangle,
} from "lucide-react";

export default function TicketDetailPanel({ ticket, onClose, onUpdateStatus }) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!ticket) return null;

  const handleSubmit = async (e, newStatus) => {
    e.preventDefault();
    if (!comment.trim() && !newStatus) return;
    setSubmitting(true);
    try {
      await onUpdateStatus(ticket.id, {
        status: newStatus || ticket.status,
        comment: comment.trim() || undefined,
      });
      setComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            New
          </span>
        );
      case "In Progress":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            In Progress
          </span>
        );
      case "Resolved":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Resolved
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1E293B] border border-slate-800 rounded-xl shadow-lg flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
        <div>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            Ticket Details
          </span>
          <h3 className="text-base font-bold text-[#F8FAFC] mt-0.5">
            {ticket.equipment}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Status & Location */}
        <div className="grid grid-cols-2 gap-4 bg-slate-800/20 p-4 rounded-lg border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Status</span>
            {getStatusBadge(ticket.status)}
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Location</span>
            <span className="text-sm font-semibold text-slate-200">
              {ticket.location}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Description
          </h4>
          <p className="text-sm text-slate-300 bg-slate-800/10 p-3 rounded-lg border border-slate-800/50 leading-relaxed">
            {ticket.description}
          </p>
        </div>

        {/* Quick Actions */}
        {ticket.status !== "Resolved" && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Update Status
            </h4>
            <div className="flex gap-3">
              {ticket.status === "New" && (
                <button
                  onClick={(e) => handleSubmit(e, "In Progress")}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4" /> Start Work
                </button>
              )}
              {ticket.status === "In Progress" && (
                <button
                  onClick={(e) => handleSubmit(e, "Resolved")}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" /> Resolve Ticket
                </button>
              )}
            </div>
          </div>
        )}

        {/* Activity Log */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Activity Log & Comments
          </h4>
          <div className="space-y-4">
            {ticket.activity_log && ticket.activity_log.length > 0 ? (
              ticket.activity_log.map((log, idx) => (
                <div
                  key={idx}
                  className="border-l-2 border-slate-700 pl-4 py-1 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      {log.author || "System"}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold italic">
                    {log.action}
                  </p>
                  {log.comment && (
                    <p className="text-sm text-slate-300 bg-slate-800/30 p-2.5 rounded border border-slate-800/50 mt-1">
                      {log.comment}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">
                No activity logged yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Comment Form */}
      {ticket.status !== "Resolved" && (
        <div className="p-4 border-t border-slate-800 bg-slate-800/20">
          <form onSubmit={(e) => handleSubmit(e, null)} className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment or update notes..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="flex items-center gap-2 bg-[#10B981] hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <MessageSquare className="h-4 w-4" /> Post Comment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
