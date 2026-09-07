import React from "react";
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function FeedbackFilterTable({
  feedbackList = [],
  total = 0,
  skip = 0,
  limit = 20,
  sentimentFilter = "",
  ratingFilter = "",
  searchQuery = "",
  onFilterChange,
  onPageChange,
  isLoading = false,
}) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value, skip: 0 });
  };

  const handleSentimentChange = (e) => {
    onFilterChange({ sentiment: e.target.value, skip: 0 });
  };

  const handleRatingChange = (e) => {
    onFilterChange({ rating: e.target.value, skip: 0 });
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-white">
            Recent Feedback Submissions
          </h2>
          <p className="text-xs text-slate-400">
            Filter and search ingested customer feedback
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={sentimentFilter}
            onChange={handleSentimentChange}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="NEGATIVE">Negative</option>
          </select>

          <select
            value={ratingFilter}
            onChange={handleRatingChange}
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
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-700 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="pb-3 px-3">ID</th>
              <th className="pb-3 px-3">Date</th>
              <th className="pb-3 px-3">Customer Email</th>
              <th className="pb-3 px-3">Rating</th>
              <th className="pb-3 px-3">Sentiment</th>
              <th className="pb-3 px-3">Category</th>
              <th className="pb-3 px-3">Feedback Text</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <div>Loading feedback records...</div>
                </td>
              </tr>
            ) : feedbackList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No feedback submissions match the selected filters.
                </td>
              </tr>
            ) : (
              feedbackList.map((item) => {
                const sentimentVal =
                  item.sentiment?.sentiment || item.status || "Pending";
                const score = item.sentiment?.confidence_score;
                const formattedDate = item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "N/A";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {item.id?.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {formattedDate}
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
                          sentimentVal.toUpperCase() === "POSITIVE"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : sentimentVal.toUpperCase() === "NEGATIVE"
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {sentimentVal}{" "}
                        {score ? `(${Math.round(score * 100)}%)` : ""}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-medium">
                      {item.category || "General"}
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-xs truncate">
                      {item.feedback_text}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
        <div>
          Showing {Math.min(total, skip + 1)} to {Math.min(total, skip + limit)}{" "}
          of {total} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, skip - limit))}
            disabled={skip === 0}
            className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-50 hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(skip + limit)}
            disabled={skip + limit >= total}
            className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-50 hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
