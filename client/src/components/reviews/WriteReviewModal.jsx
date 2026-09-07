import React, { useState } from "react";
import { Star, X, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { submitBoxReview, loginUser } from "../../services/api";

export default function WriteReviewModal({
  boxId,
  boxTitle,
  isOpen,
  onClose,
  onReviewSubmitted,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Test credentials for quick login if unauthenticated
  const [loginEmail, setLoginEmail] = useState("test@example.com");
  const [loginPassword, setLoginPassword] = useState("testpassword");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage("Please select a star rating between 1 and 5 stars.");
      return;
    }

    if (!comment.trim()) {
      setErrorMessage("Please enter a written review comment.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        // Automatically attempt login with test account if token absent
        try {
          await loginUser(loginEmail, loginPassword);
        } catch (authErr) {
          setShowLoginPrompt(true);
          setErrorMessage(
            "You must be signed in to submit a review. Please sign in below.",
          );
          setLoading(false);
          return;
        }
      }

      await submitBoxReview(boxId, { rating, comment });
      setComment("");
      setRating(5);
      onClose();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      if (err.response?.status === 401) {
        setShowLoginPrompt(true);
        setErrorMessage(
          "Authentication required. Please sign in to submit your review.",
        );
      } else {
        const msg =
          err.response?.data?.detail ||
          "Failed to submit review. Please try again.";
        setErrorMessage(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await loginUser(loginEmail, loginPassword);
      setShowLoginPrompt(false);
      // Re-trigger review submit
      await submitBoxReview(boxId, { rating, comment });
      setComment("");
      setRating(5);
      onClose();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || "Sign in failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Write Subscriber Review
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              {boxTitle || "Subscription Box Curation"}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {showLoginPrompt ? (
          <form onSubmit={handleQuickLoginSubmit} className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-2">
              <span className="font-bold block mb-1">
                Subscriber Login Required:
              </span>
              <span>Test account details pre-filled below:</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? "Authenticating..." : "Sign In & Submit Review"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Overall Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 fill-slate-100"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-slate-700">
                  {hoverRating || rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Written Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Written Review
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your experience with this month's curation, product quality, value for money, and unboxing highlights..."
                className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:outline-none text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Test Credentials Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Reviews submitted with test account:</span>
              <code className="font-mono bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-800">
                test@example.com
              </code>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-primary font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting Review..." : "Post Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
