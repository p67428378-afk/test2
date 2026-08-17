import React from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Bot,
  UserCheck,
} from "lucide-react";

export const Timeline = ({ history = [], loading = false }) => {
  if (loading) {
    return (
      <div className="py-6 text-center text-sm text-slate-500">
        Loading audit history...
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-slate-400">
        No audit logs recorded for this item yet.
      </div>
    );
  }

  const getActionIcon = (action) => {
    const act = (action || "").toLowerCase();
    if (act.includes("created") || act.includes("reported"))
      return <FileText className="w-4 h-4 text-indigo-600" />;
    if (act.includes("match") || act.includes("ai"))
      return <Bot className="w-4 h-4 text-amber-600" />;
    if (act.includes("approved") || act.includes("verified"))
      return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    if (act.includes("rejected"))
      return <XCircle className="w-4 h-4 text-rose-600" />;
    if (act.includes("claim"))
      return <UserCheck className="w-4 h-4 text-blue-600" />;
    return <Clock className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 my-4">
      {history.map((entry, index) => (
        <div key={entry.id || index} className="relative group">
          <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-sm">
            {getActionIcon(entry.action)}
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-xs uppercase tracking-wider text-slate-700">
                {entry.action}
              </span>
              <span className="text-[11px] text-slate-400">
                {entry.created_at
                  ? new Date(entry.created_at).toLocaleString()
                  : ""}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">{entry.details}</p>
            {entry.actor_id && (
              <p className="text-[11px] text-slate-400 mt-1">
                Actor ID: {entry.actor_id}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
