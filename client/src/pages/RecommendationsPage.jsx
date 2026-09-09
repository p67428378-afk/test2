import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import RecommendationCard from "../components/RecommendationCard";
import RecommendationToolbar from "../components/RecommendationToolbar";
import SavedItemsList from "../components/SavedItemsList";
import RecommendationHistoryTable from "../components/RecommendationHistoryTable";
import FallbackBanner from "../components/FallbackBanner";
import {
  Sparkles,
  Bookmark,
  History,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function RecommendationsPage({
  userId = "user-123",
  onAddToCart,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "recommendations";

  const [activeTab, setActiveTab] = useState(
    ["recommendations", "saved", "history"].includes(initialTab)
      ? initialTab
      : "recommendations",
  );

  const [activeUserId, setActiveUserId] = useState(userId);
  const [limit, setLimit] = useState(6);
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("match_score");
  const [sortOrder, setSortOrder] = useState("desc");

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState("");
  const [savedCount, setSavedCount] = useState(0);

  // Synchronize tab changes to search params
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "recommendations") {
      searchParams.delete("tab");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab });
    }
  };

  const handleGenerate = useCallback(
    async (
      uid = activeUserId,
      recLimit = limit,
      recMinRating = minRating,
      recSortBy = sortBy,
      recSortOrder = sortOrder,
    ) => {
      if (!uid.trim()) return;
      setLoading(true);
      setError(null);
      setFeedbackToast("");
      try {
        const payload = {
          user_id: uid.trim(),
          limit: Number(recLimit),
          sort_by: recSortBy || "match_score",
          sort_order: recSortOrder || "desc",
        };
        if (recMinRating) {
          payload.min_rating = Number(recMinRating);
        }

        const data = await api.generateRecommendations(payload);
        setRecommendations(data.recommendations || []);
        setHasGenerated(true);
      } catch (err) {
        const detail =
          err.response?.data?.detail ||
          err.message ||
          "Failed to generate recommendations.";
        setError(typeof detail === "string" ? detail : JSON.stringify(detail));
      } finally {
        setLoading(false);
      }
    },
    [activeUserId, limit, minRating, sortBy, sortOrder],
  );

  // Initial load or when active tab is recommendations
  useEffect(() => {
    if (activeTab === "recommendations") {
      handleGenerate(activeUserId, limit, minRating, sortBy, sortOrder);
    }
  }, [
    handleGenerate,
    activeTab,
    activeUserId,
    limit,
    minRating,
    sortBy,
    sortOrder,
  ]);

  const handleFeedbackSubmitted = (recId, type) => {
    setFeedbackToast(
      `Feedback (${type === "like" ? "Liked 👍" : "Disliked 👎"}) recorded. Engine weights updated!`,
    );
    setTimeout(() => {
      setFeedbackToast("");
    }, 4000);
  };

  const handleBookmarkSaved = () => {
    setSavedCount((prev) => prev + 1);
  };

  const hasFallback = recommendations.some(
    (r) =>
      r.recommendation_type === "fallback_top_rated" ||
      r.recommendation_type === "fallback",
  );

  const avgScore =
    recommendations.length > 0
      ? (
          (recommendations.reduce(
            (acc, curr) => acc + (curr.match_score || 0),
            0,
          ) /
            recommendations.length) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Personalization & Recommendations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Personalized Picks & Saved Items
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Discover AI-curated products tailored to your preferences, bookmark
            favorites for later, and review past recommendation sessions and
            telemetry.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4">
        <button
          type="button"
          onClick={() => handleTabChange("recommendations")}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all ${
            activeTab === "recommendations"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Recommendations</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("saved")}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all ${
            activeTab === "saved"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Items</span>
          {savedCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
              {savedCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("history")}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all ${
            activeTab === "history"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Session History & Audit</span>
        </button>
      </div>

      {/* TAB 1: AI RECOMMENDATIONS */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          {/* Recommendation Filtering & Sorting Toolbar */}
          <RecommendationToolbar
            activeUserId={activeUserId}
            onUserIdChange={setActiveUserId}
            limit={limit}
            onLimitChange={setLimit}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onRefresh={() =>
              handleGenerate(activeUserId, limit, minRating, sortBy, sortOrder)
            }
            loading={loading}
            resultCount={recommendations.length}
            avgScore={avgScore}
          />

          {/* Feedback Toast */}
          {feedbackToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs font-medium animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackToast}</span>
            </div>
          )}

          {/* Fallback Banner */}
          {hasFallback && (
            <FallbackBanner message="Some recommendations are trending top-picks due to minimal category or tag overlap." />
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Recommendation Generation Failed</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={() =>
                    handleGenerate(
                      activeUserId,
                      limit,
                      minRating,
                      sortBy,
                      sortOrder,
                    )
                  }
                  className="mt-2 text-xs font-bold text-rose-700 underline hover:text-rose-900"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Grid or Empty/Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-600">
                Running AI Vector Content Matching & Scoring...
              </p>
            </div>
          ) : recommendations.length === 0 && hasGenerated ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Recommendations Available
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                We couldn&rsquo;t find matching recommendations for user &ldquo;
                {activeUserId}&rdquo; with the selected filters. Try adjusting
                your min rating filter or saving your preferences.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.recommendation_id || rec.product?.id}
                  recommendation={rec}
                  userId={activeUserId}
                  onAddToCart={onAddToCart}
                  onFeedbackSubmitted={handleFeedbackSubmitted}
                  onBookmarkSaved={handleBookmarkSaved}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED ITEMS */}
      {activeTab === "saved" && (
        <SavedItemsList
          userId={activeUserId}
          onAddToCart={onAddToCart}
          onItemsUpdated={setSavedCount}
        />
      )}

      {/* TAB 3: SESSION HISTORY & AUDIT */}
      {activeTab === "history" && (
        <RecommendationHistoryTable userId={activeUserId} />
      )}
    </div>
  );
}
