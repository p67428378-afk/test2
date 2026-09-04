import React from "react";
import { Search, Star, RefreshCw, AlertCircle } from "lucide-react";

export default function FeedbackFilterTable({
  feedbackList = [],
  total = 0,
  searchQuery = "",
  onSearchChange,
  sentimentFilter = "",
  onSentimentChange,
  ratingFilter = "",
  onRatingChange,
  onReanalyze,
  reanalyzingId = null,
  isLoading = false,
}) {
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return (
        d.toLocaleDateString() +
        " " +
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-white">
            Recent Feedback Submissions
          </h2>
          <p className="text-xs text-slate-400">Total: {total} items</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search text or email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <select
            value={sentimentFilter}
            onChange={(e) => onSentimentChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => onRatingChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading feedback stream...
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6 text-slate-600" />
            <span>No feedback entries match the selected filters.</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-3 px-3">ID</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Customer Email</th>
                <th className="pb-3 px-3">Rating</th>
                <th className="pb-3 px-3">Sentiment</th>
                <th className="pb-3 px-3">Topics</th>
                <th className="pb-3 px-3">Feedback Text</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {feedbackList.map((item) => {
                const sentimentName =
                  item.sentiment_analysis?.sentiment || "Pending";
                const scorePct =
                  item.sentiment_analysis?.score != null
                    ? Math.round(item.sentiment_analysis.score * 100)
                    : null;
                const topicsStr =
                  item.topics && item.topics.length > 0
                    ? item.topics.map((t) => t.topic_name).join(", ")
                    : "-";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    <td
                      className="py-3 px-3 font-mono text-slate-400 truncate max-w-[100px]"
                      title={item.id}
                    >
                      {item.id ? `${item.id.substring(0, 8)}...` : "-"}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {item.customer_email || "Anonymous"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        {item.rating}{" "}
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          sentimentName === "Positive"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : sentimentName === "Negative"
                              ? "bg-rose-500/10 text-rose-400"
                              : sentimentName === "Neutral"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {sentimentName}{" "}
                        {scorePct !== null ? `(${scorePct}%)` : ""}
                      </span>
                    </td>
                    <td
                      className="py-3 px-3 text-slate-300 font-medium max-w-[140px] truncate"
                      title={topicsStr}
                    >
                      {topicsStr}
                    </td>
                    <td
                      className="py-3 px-3 text-slate-300 max-w-xs truncate"
                      title={item.feedback_text}
                    >
                      {item.feedback_text}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onReanalyze && onReanalyze(item.id)}
                        disabled={reanalyzingId === item.id}
                        title="Re-trigger AI Sentiment Analysis"
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 hover:border-slate-600 transition inline-flex items-center gap-1 text-[11px] disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${reanalyzingId === item.id ? "animate-spin" : ""}`}
                        />
                        <span>Reanalyze</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
