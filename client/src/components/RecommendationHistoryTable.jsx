import React, { useState, useEffect, useCallback } from "react";
import {
  History,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { api } from "../services/api";
import PaginationBar from "./PaginationBar";

export default function RecommendationHistoryTable({ userId = "user-123" }) {
  const [sessions, setSessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRecommendationHistory({
        user_id: userId.trim(),
        skip,
        limit,
      });
      setSessions(data.sessions || []);
      setTotal(data.total || 0);
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load recommendation session history.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  }, [userId, skip, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const toggleExpand = (sessionId) => {
    setExpandedSessionId((prev) => (prev === sessionId ? null : sessionId));
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "—";
    try {
      const d = new Date(ts);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  const getSessionFeedbackSummary = (items = []) => {
    let likes = 0;
    let dislikes = 0;
    items.forEach((it) => {
      if (it.feedback === "like") likes += 1;
      if (it.feedback === "dislike") dislikes += 1;
    });
    if (likes === 0 && dislikes === 0) return "No feedback given";
    const parts = [];
    if (likes > 0) parts.push(`${likes} Like${likes > 1 ? "s" : ""}`);
    if (dislikes > 0)
      parts.push(`${dislikes} Dislike${dislikes > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  const calculateAvgMatch = (items = []) => {
    if (!items || items.length === 0) return "—";
    const sum = items.reduce((acc, curr) => acc + (curr.match_score || 0), 0);
    return `${((sum / items.length) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error loading session history</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            <button
              type="button"
              onClick={fetchHistory}
              className="mt-2 text-xs font-bold text-rose-700 underline hover:text-rose-900"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Fetching recommendation session history & telemetry...
          </p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Session History Available
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            You have not initiated any AI recommendation sessions yet. Generate
            recommendations to view session logs and telemetry.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Session ID</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Total Items</th>
                  <th className="px-6 py-4">Avg Match</th>
                  <th className="px-6 py-4">Feedback Telemetry</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((sess) => {
                  const isExpanded = expandedSessionId === sess.session_id;
                  const avgScore = calculateAvgMatch(sess.items);
                  const feedbackSummary = getSessionFeedbackSummary(sess.items);

                  return (
                    <React.Fragment key={sess.session_id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-slate-900">
                          {sess.session_id}
                        </td>
                        <td className="px-6 py-4 text-slate-600 flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatTimestamp(sess.timestamp)}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {sess.total_recommendations ||
                            sess.items?.length ||
                            0}{" "}
                          items
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-600">
                          {avgScore}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center space-x-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full text-[11px] font-medium">
                            {feedbackSummary}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => toggleExpand(sess.session_id)}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition-colors"
                          >
                            <span>{isExpanded ? "Hide" : "View"}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Session Items Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/60">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                              <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Recommended Items in this Session</span>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {sess.items && sess.items.length > 0 ? (
                                  sess.items.map((it, idx) => (
                                    <div
                                      key={`${sess.session_id}-${it.recommendation_id || idx}`}
                                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col justify-between space-y-2"
                                    >
                                      <div>
                                        <p className="font-bold text-slate-900 truncate">
                                          {it.product_name ||
                                            it.recommendation_id}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                          Match:{" "}
                                          <span className="font-semibold text-indigo-600">
                                            {(
                                              (it.match_score || 0) * 100
                                            ).toFixed(1)}
                                            %
                                          </span>
                                        </p>
                                      </div>
                                      <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-400">
                                          Feedback:
                                        </span>
                                        {it.feedback === "like" ? (
                                          <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                                            <ThumbsUp className="w-3 h-3 text-emerald-600" />
                                            <span>Liked</span>
                                          </span>
                                        ) : it.feedback === "dislike" ? (
                                          <span className="inline-flex items-center space-x-1 text-rose-700 font-semibold">
                                            <ThumbsDown className="w-3 h-3 text-rose-600" />
                                            <span>Disliked</span>
                                          </span>
                                        ) : (
                                          <span className="text-slate-400 italic">
                                            None
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-slate-400 text-xs italic">
                                    No item records found for this session.
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <PaginationBar
              total={total}
              skip={skip}
              limit={limit}
              onPageChange={(newSkip) => setSkip(newSkip)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
