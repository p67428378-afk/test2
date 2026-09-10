import React from "react";
import {
  History,
  Clock,
  FileText,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function RecentHistorySidebar({
  recentEmails = [],
  onSelectEmail,
  onRefresh,
}) {
  const getCategoryBadgeColor = (category) => {
    switch (category?.toLowerCase()) {
      case "urgent":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "work":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "personal":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "promotional":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "Just now";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Recent Stream</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {recentEmails.length}
          </span>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Refresh
          </button>
        )}
      </div>

      {/* Stream Items List */}
      <div className="p-3 divide-y divide-slate-100 overflow-y-auto max-h-[620px] flex-1">
        {recentEmails.length === 0 ? (
          <div className="py-12 text-center">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">
              No recent classifications
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit an email or file to see real-time updates here.
            </p>
          </div>
        ) : (
          recentEmails.map((email) => {
            const category =
              email.classification?.user_override_category ||
              email.classification?.primary_category ||
              email.classification?.ai_category ||
              "Work";
            const isOverridden = email.classification?.is_overridden;
            const confidence = email.classification?.confidence_score ?? 0;

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail && onSelectEmail(email)}
                className="py-3 px-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getCategoryBadgeColor(
                        category,
                      )}`}
                    >
                      {category}
                    </span>
                    {isOverridden && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Overridden
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatTimestamp(email.created_at)}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {email.subject ||
                    (email.file_name
                      ? `File: ${email.file_name}`
                      : "Untitled Email")}
                </p>

                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {email.excerpt || email.body_text}
                </p>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>
                      {email.source_type === "FILE_UPLOAD"
                        ? "File Upload"
                        : "Direct Text"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 group-hover:text-indigo-600">
                    <span>{confidence.toFixed(0)}% score</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer hint */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Click any item
          to inspect or override
        </p>
      </div>
    </div>
  );
}
