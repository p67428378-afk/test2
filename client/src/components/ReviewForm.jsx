import React, { useState } from "react";
import {
  Star,
  CheckCircle,
  AlertCircle,
  Send,
  MessageSquare,
} from "lucide-react";
import { submitReview } from "../services/api";

export default function ReviewForm({
  onReviewSubmitted,
  initialBookingId = "",
}) {
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingId.trim()) {
      setError("Please provide a valid Booking Reservation ID.");
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitReview({
        booking_id: bookingId.trim(),
        rating: Number(rating),
        comment: comment.trim() ? comment.trim() : null,
      });

      setSuccessData(response.data);
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data);
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        (Array.isArray(err.response?.data)
          ? err.response?.data[0]?.msg
          : null) ||
        "Failed to submit feedback. Only completed (attended) bookings can be reviewed, and each booking may only be reviewed once.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingId("");
    setRating(5);
    setHoverRating(0);
    setComment("");
    setError(null);
    setSuccessData(null);
  };

  if (successData) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-emerald-900 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-950">
              Thank You for Your Feedback!
            </h3>
            <p className="text-xs text-emerald-700">
              Your review and rating have been recorded successfully.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/60 space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-emerald-100">
            <span className="text-emerald-700 font-medium">Review ID:</span>
            <span className="font-mono text-emerald-900 font-semibold">
              {successData.id}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-emerald-100">
            <span className="text-emerald-700 font-medium">Booking ID:</span>
            <span className="font-mono text-emerald-900">
              {successData.booking_id}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-emerald-100">
            <span className="text-emerald-700 font-medium">Rating Given:</span>
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <span>{successData.rating}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          {successData.comment && (
            <div className="pt-1">
              <span className="text-emerald-700 font-medium block mb-1">
                Your Comments:
              </span>
              <p className="text-emerald-900 italic bg-emerald-50/50 p-2 rounded border border-emerald-100">
                "{successData.comment}"
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          Submit Another Review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>Visitor Review & Rating</span>
        </h3>
        <p className="text-xs text-slate-500">
          Share your guided tour experience. Reviews can only be submitted for
          completed, attended tours.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Review Submission Error</p>
            <p className="mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Booking ID Input */}
      <div>
        <label
          htmlFor="booking_id"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Booking Reservation ID <span className="text-rose-500">*</span>
        </label>
        <input
          id="booking_id"
          type="text"
          required
          placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Found on your tour reservation ticket or confirmation receipt.
        </p>
      </div>

      {/* Interactive 1-5 Star Rating */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Overall Rating (1 to 5 Stars) <span className="text-rose-500">*</span>
        </label>
        <div
          className="flex items-center gap-2"
          role="radiogroup"
          aria-label="Star Rating"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 rounded-lg transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Star
                className={`w-8 h-8 transition ${
                  (hoverRating || rating) >= star
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-3 text-sm font-bold text-slate-700">
            {hoverRating || rating} / 5 Stars
          </span>
        </div>
      </div>

      {/* Written Comment */}
      <div>
        <label
          htmlFor="review_comment"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Review Comments (Optional)
        </label>
        <textarea
          id="review_comment"
          rows={4}
          placeholder="Share your thoughts about the exhibits, tour pacing, and your assigned guide..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !bookingId.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 transition"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Submitting Review...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Feedback</span>
          </>
        )}
      </button>
    </form>
  );
}

export { ReviewForm as VisitorFeedbackForm };
