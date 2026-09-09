import React, { useState } from "react";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Star,
  ShoppingCart,
  Check,
  Tag,
} from "lucide-react";
import { api } from "../services/api";

export default function RecommendationCard({
  recommendation,
  userId = "user-123",
  onAddToCart,
  onFeedbackSubmitted,
}) {
  if (!recommendation) return null;

  const {
    recommendation_id,
    product = {},
    match_score = 0.85,
    recommendation_type = "ai_vector",
  } = recommendation;

  const [feedbackState, setFeedbackState] = useState(null); // 'like' | 'dislike' | null
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const matchPercent = Math.min(Math.max(match_score * 100, 0), 100).toFixed(1);

  const handleFeedback = async (type) => {
    setFeedbackError("");
    setSubmittingFeedback(true);
    try {
      const payload = {
        recommendation_id,
        user_id: userId,
        feedback: type,
      };
      await api.submitFeedback(payload);
      setFeedbackState(type);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(recommendation_id, type);
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to submit feedback.";
      setFeedbackError(
        typeof detail === "string" ? detail : JSON.stringify(detail),
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const isFallback =
    recommendation_type === "fallback_top_rated" ||
    recommendation_type === "fallback";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header Banner */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 via-violet-50 to-amber-50/40 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                isFallback
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-indigo-600 text-white shadow-sm"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>
                {isFallback ? "Popular Pick" : `${matchPercent}% Match`}
              </span>
            </span>

            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {product.category || "General"}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div>
            <h3
              className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors"
              title={product.name}
            >
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {product.description ||
                "Recommended based on your preferences, category interests, and budget alignment."}
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.tags.map((tag) => (
                <span
                  key={`${recommendation_id}-tag-${tag}`}
                  className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                >
                  <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Match Score Meter */}
          {!isFallback && (
            <div className="pt-2">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-1">
                <span>Vector Relevance Score</span>
                <span className="text-indigo-600">{matchPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions & Feedback */}
      <div className="p-5 pt-0 space-y-3">
        {/* Feedback Row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium">
            Is this recommendation relevant?
          </span>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              disabled={submittingFeedback}
              onClick={() => handleFeedback("like")}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-all ${
                feedbackState === "like"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
              }`}
              title="Like this recommendation"
              aria-label="Like recommendation"
            >
              <ThumbsUp
                className={`w-3.5 h-3.5 ${feedbackState === "like" ? "fill-emerald-600" : ""}`}
              />
              {feedbackState === "like" && (
                <span className="text-[10px]">Liked</span>
              )}
            </button>

            <button
              type="button"
              disabled={submittingFeedback}
              onClick={() => handleFeedback("dislike")}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-all ${
                feedbackState === "dislike"
                  ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600"
              }`}
              title="Dislike this recommendation"
              aria-label="Dislike recommendation"
            >
              <ThumbsDown
                className={`w-3.5 h-3.5 ${feedbackState === "dislike" ? "fill-rose-600" : ""}`}
              />
              {feedbackState === "dislike" && (
                <span className="text-[10px]">Disliked</span>
              )}
            </button>
          </div>
        </div>

        {feedbackError && (
          <p className="text-[11px] text-rose-600 font-medium">
            {feedbackError}
          </p>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-extrabold text-slate-900">
            ${(product.price || 0).toFixed(2)}
          </span>

          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(product)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
