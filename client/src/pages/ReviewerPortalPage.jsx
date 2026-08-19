import React, { useState, useEffect } from "react";
import { sessionApi, reviewApi } from "../services/api";
import DataTable from "../components/common/DataTable";
import {
  CheckSquare,
  Star,
  MessageSquare,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ReviewerPortalPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [score, setScore] = useState(5);
  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState("APPROVED");
  const [sessionReviews, setSessionReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionApi.listSessions();
      setSessions(data || []);
      if (data && data.length > 0) {
        setSelectedSession(data[0]);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load sessions for review.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      reviewApi
        .getSessionReviews(selectedSession.id)
        .then((res) => setSessionReviews(res || []))
        .catch(() => setSessionReviews([]));
    }
  }, [selectedSession]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await reviewApi.submitReview({
        session_id: selectedSession.id,
        score: parseInt(score, 10),
        comments,
        decision,
      });

      setSuccess(
        `Review for "${selectedSession.title}" submitted as ${decision}!`,
      );
      setComments("");

      // Refresh session and reviews
      fetchSessions();
      const updatedReviews = await reviewApi.getSessionReviews(
        selectedSession.id,
      );
      setSessionReviews(updatedReviews || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit review. Reviewer or Organizer role required.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <span className="font-semibold text-[#171c29]">{row.title}</span>
      ),
    },
    {
      header: "Track",
      accessor: "track",
      render: (row) => (
        <span className="px-2 py-0.5 text-xs font-mono bg-blue-50 text-blue-700 rounded border border-blue-100">
          {row.track}
        </span>
      ),
    },
    {
      header: "Current Status",
      accessor: "status",
      render: (row) => {
        const isApproved = row.status === "APPROVED";
        const isRejected = row.status === "REJECTED";
        return (
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              isApproved
                ? "bg-green-100 text-green-800"
                : isRejected
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessor: "id",
      render: (row) => (
        <button
          onClick={() => setSelectedSession(row)}
          className={`px-3 py-1 text-xs font-medium rounded ${
            selectedSession?.id === row.id
              ? "bg-[#2663eb] text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {selectedSession?.id === row.id ? "Selected" : "Review"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Session Proposal Review & Scoring
        </h1>
        <p className="text-sm text-[#707a8c]">
          Evaluate submitted abstract proposals and record final decision
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: List of Sessions to Review */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#171c29]">
            Sessions Pending Evaluation
          </h2>
          <DataTable
            columns={columns}
            data={sessions}
            loading={loading}
            emptyMessage="No session proposals available to review."
          />
        </div>

        {/* Right Column: Review Evaluation Form */}
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#171c29] flex items-center gap-2 border-b pb-3 border-[#e3e8f0]">
            <CheckSquare className="w-5 h-5 text-[#2663eb]" />
            <span>Evaluation Panel</span>
          </h2>

          {selectedSession ? (
            <div className="space-y-6">
              {/* Selected Session Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {selectedSession.track}
                </span>
                <h3 className="font-bold text-[#171c29]">
                  {selectedSession.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {selectedSession.abstract}
                </p>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171c29] uppercase mb-2">
                    Score (1 = Low, 5 = Excellent):{" "}
                    <span className="text-blue-600 font-bold">{score} / 5</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setScore(num)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all flex items-center justify-center gap-1 ${
                          score === num
                            ? "bg-[#2663eb] text-white border-[#2663eb]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${score === num ? "fill-white" : "text-gray-400"}`}
                        />
                        <span>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                    Decision *
                  </label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  >
                    <option value="APPROVED">APPROVED (Accept Proposal)</option>
                    <option value="REJECTED">
                      REJECTED (Decline Proposal)
                    </option>
                    <option value="UNDER_REVIEW">
                      UNDER REVIEW (Needs further discussion)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                    Reviewer Comments
                  </label>
                  <textarea
                    rows="3"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                    placeholder="Provide constructive feedback and justification for your decision..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#2663eb] text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Evaluation"}
                </button>
              </form>

              {/* Past Reviews for this session */}
              {sessionReviews.length > 0 && (
                <div className="pt-4 border-t border-[#e3e8f0] space-y-3">
                  <h4 className="text-xs font-bold text-[#171c29] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Existing Reviews ({sessionReviews.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {sessionReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-blue-600">
                            Score: {rev.score}/5
                          </span>
                          <span className="px-2 py-0.5 bg-gray-200 rounded uppercase text-[10px]">
                            {rev.decision}
                          </span>
                        </div>
                        {rev.comments && (
                          <p className="text-gray-600 italic">
                            "{rev.comments}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-[#707a8c] py-12">
              Select a session on the left to evaluate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
