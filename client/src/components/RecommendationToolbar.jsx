import React from "react";
import { Link } from "react-router-dom";
import { Sliders, RefreshCw, Star, ArrowUpDown, Filter } from "lucide-react";

export default function RecommendationToolbar({
  activeUserId = "user-123",
  onUserIdChange,
  limit = 6,
  onLimitChange,
  minRating = "",
  onMinRatingChange,
  sortBy = "match_score",
  onSortByChange,
  sortOrder = "desc",
  onSortOrderChange,
  onRefresh,
  loading = false,
  resultCount = 0,
  avgScore = 0,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Controls: User ID, Limit, Min Rating, Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* User ID */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="user-select-input"
              className="text-xs font-semibold text-slate-700"
            >
              User ID:
            </label>
            <input
              id="user-select-input"
              type="text"
              value={activeUserId}
              onChange={(e) => onUserIdChange && onUserIdChange(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-28"
            />
          </div>

          {/* Min Rating */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="min-rating-select"
              className="text-xs font-semibold text-slate-700 flex items-center space-x-1"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Min Rating:</span>
            </label>
            <select
              id="min-rating-select"
              value={minRating}
              onChange={(e) =>
                onMinRatingChange && onMinRatingChange(e.target.value)
              }
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Ratings</option>
              <option value="3.0">&gt;= 3.0 Stars</option>
              <option value="3.5">&gt;= 3.5 Stars</option>
              <option value="4.0">&gt;= 4.0 Stars</option>
              <option value="4.5">&gt;= 4.5 Stars</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="sort-by-select"
              className="text-xs font-semibold text-slate-700 flex items-center space-x-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Sort By:</span>
            </label>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => onSortByChange && onSortByChange(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="match_score">Match Score</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center space-x-2">
            <select
              id="sort-order-select"
              value={sortOrder}
              onChange={(e) =>
                onSortOrderChange && onSortOrderChange(e.target.value)
              }
              aria-label="Sort Order"
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="desc">High to Low (Desc)</option>
              <option value="asc">Low to High (Asc)</option>
            </select>
          </div>

          {/* Limit */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="limit-select"
              className="text-xs font-semibold text-slate-700"
            >
              Limit:
            </label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) =>
                onLimitChange && onLimitChange(Number(e.target.value))
              }
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={3}>Top 3</option>
              <option value={6}>Top 6</option>
              <option value={12}>Top 12</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5 justify-end">
          <Link
            to="/preferences"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </Link>

          <button
            type="button"
            disabled={loading || !activeUserId.trim()}
            onClick={onRefresh}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>{loading ? "Analyzing..." : "Refresh Picks"}</span>
          </button>
        </div>
      </div>

      {/* Metrics strip if results present */}
      {!loading && resultCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-900">
              {resultCount} Recommendations Found
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Avg Score:{" "}
              <strong className="text-indigo-600">{avgScore}%</strong>
            </span>
            {minRating && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-medium text-[11px]">
                  <Filter className="w-3 h-3 text-amber-600" />
                  <span>Rating &gt;= {minRating}</span>
                </span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Sorted by {sortBy.replace("_", " ")} ({sortOrder})
          </span>
        </div>
      )}
    </div>
  );
}
