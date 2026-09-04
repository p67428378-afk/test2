import React, { useState } from "react";
import {
  Star,
  Send,
  CheckCircle2,
  MessageSquare,
  Mail,
  AlertCircle,
} from "lucide-react";
import { submitFeedback } from "../services/api";

export default function FeedbackSubmissionForm({ onOpenAdmin }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!feedbackText.trim()) {
      setError("Please enter your feedback text.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const response = await submitFeedback({
        rating,
        feedback_text: feedbackText,
        customer_email: email.trim() || null,
      });
      setSubmittedData(response);
    } catch (err) {
      console.error("Submission error:", err);
      const apiDetail = err.response?.data?.detail;
      const errorMessage =
        typeof apiDetail === "string"
          ? apiDetail
          : Array.isArray(apiDetail)
            ? apiDetail.map((d) => d.msg).join(", ")
            : "Failed to submit feedback. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedData(null);
    setRating(0);
    setFeedbackText("");
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white">
            Customer Feedback Hub
          </span>
        </div>
        <button
          onClick={onOpenAdmin}
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition"
        >
          Admin Portal &rarr;
        </button>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        {submittedData ? (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl backdrop-blur">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Thank You for Your Feedback!
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Your feedback has been submitted successfully. Our AI system is
              analyzing your response to help us improve our services.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-xl text-left border border-slate-800 mb-6 text-xs text-slate-400 font-mono space-y-1">
              <div>
                <span className="text-slate-500">Submission ID:</span>{" "}
                {submittedData.id}
              </div>
              <div>
                <span className="text-slate-500">Analysis Status:</span>{" "}
                {submittedData.analysis_status || "Pending Analysis"}
              </div>
              {submittedData.sentiment_analysis?.sentiment && (
                <div>
                  <span className="text-slate-500">AI Sentiment:</span>{" "}
                  <span className="text-emerald-400 font-semibold">
                    {submittedData.sentiment_analysis.sentiment}
                  </span>{" "}
                  (
                  {Math.round(
                    (submittedData.sentiment_analysis.score || 0) * 100,
                  )}
                  % score)
                </div>
              )}
              {submittedData.topics && submittedData.topics.length > 0 && (
                <div>
                  <span className="text-slate-500">Identified Topics:</span>{" "}
                  {submittedData.topics.map((t) => t.topic_name).join(", ")}
                </div>
              )}
            </div>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">
                Share Your Experience
              </h1>
              <p className="text-sm text-slate-400">
                We value your input. Help us enhance our platform by providing
                your honest feedback.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Overall Rating <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} stars`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-medium text-slate-300">
                    {rating > 0 ? `${rating} of 5 Stars` : "Select rating"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Your Feedback <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us about what you liked, or areas where we can improve..."
                  maxLength={1000}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                />
                <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                  <span>Be as detailed as possible.</span>
                  <span>{feedbackText.length}/1000</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address{" "}
                  <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
