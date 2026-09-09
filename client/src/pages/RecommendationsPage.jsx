import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import RecommendationCard from "../components/RecommendationCard";
import FallbackBanner from "../components/FallbackBanner";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  Loader2,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function RecommendationsPage({
  userId = "user-123",
  onAddToCart,
}) {
  const [activeUserId, setActiveUserId] = useState(userId);
  const [limit, setLimit] = useState(6);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState("");

  const handleGenerate = useCallback(
    async (uid = activeUserId, recLimit = limit) => {
      if (!uid.trim()) return;
      setLoading(true);
      setError(null);
      setFeedbackToast("");
      try {
        const data = await api.generateRecommendations({
          user_id: uid.trim(),
          limit: Number(recLimit),
        });
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
    [activeUserId, limit],
  );

  // Initial load
  useEffect(() => {
    handleGenerate(activeUserId, limit);
  }, [handleGenerate, activeUserId, limit]);

  const handleFeedbackSubmitted = (recId, type) => {
    setFeedbackToast(
      `Feedback (${type === "like" ? "Liked 👍" : "Disliked 👎"}) recorded. Engine weights updated!`,
    );
    setTimeout(() => {
      setFeedbackToast("");
    }, 4000);
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
            <span>AI Personalization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Personalized Picks for You
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Our recommendation engine computes cosine similarities between your
            preference profile and catalog item embeddings to curate the most
            relevant products.
          </p>
        </div>
      </div>

      {/* Control Bar (User Switcher, Limit, Refresh) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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
              onChange={(e) => setActiveUserId(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
            />
          </div>

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
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={3}>Top 3</option>
              <option value={6}>Top 6</option>
              <option value={12}>Top 12</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
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
            onClick={() => handleGenerate(activeUserId, limit)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>{loading ? "Analyzing..." : "Refresh Picks"}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Fallback Banner (if fallback recommendations returned) */}
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
              onClick={() => handleGenerate(activeUserId, limit)}
              className="mt-2 text-xs font-bold text-rose-700 underline hover:text-rose-900"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* AI Score Summary Banner */}
      {!loading && recommendations.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Matched Items
              </span>
              <span className="text-sm font-bold text-slate-900">
                {recommendations.length} Products
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Average Relevance
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {avgScore}% Confidence
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic">
            Scored via Vector Cosine Similarity against User{" "}
            <code className="font-mono text-slate-700">{activeUserId}</code>
          </div>
        </div>
      )}

      {/* Recommendations List Grid */}
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
            {activeUserId}&rdquo;. Try saving your preferences first.
          </p>
          <Link
            to="/preferences"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Configure Preferences
          </Link>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
