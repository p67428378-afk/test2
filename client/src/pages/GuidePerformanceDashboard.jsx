import React, { useState, useEffect } from "react";
import {
  Users,
  Star,
  BarChart3,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import RatingBreakdown from "../components/RatingBreakdown";
import {
  getAdminFeedbackSummary,
  getGuides,
  getGuideMetrics,
} from "../services/api";

export default function GuidePerformanceDashboard() {
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [guides, setGuides] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [guideMetrics, setGuideMetrics] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
  const [error, setError] = useState(null);

  const loadInitialData = async () => {
    setIsLoadingSummary(true);
    setError(null);
    try {
      const [summaryRes, guidesRes] = await Promise.all([
        getAdminFeedbackSummary(),
        getGuides(),
      ]);
      setFeedbackSummary(summaryRes.data);
      const guideList = guidesRes.data || [];
      setGuides(guideList);

      if (guideList.length > 0) {
        setSelectedGuideId(guideList[0].id);
        fetchGuideMetrics(guideList[0].id);
      }
    } catch (err) {
      setError(
        "Unable to load feedback metrics. Please ensure backend services are reachable.",
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const fetchGuideMetrics = async (guideId) => {
    if (!guideId) return;
    setIsLoadingGuide(true);
    try {
      const res = await getGuideMetrics(guideId);
      setGuideMetrics(res.data);
    } catch (err) {
      console.error("Failed to load guide metrics:", err);
      setGuideMetrics(null);
    } finally {
      setIsLoadingGuide(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleGuideChange = (e) => {
    const id = e.target.value;
    setSelectedGuideId(id);
    fetchGuideMetrics(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero / Header Section */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-semibold backdrop-blur-sm">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Administrative Quality & Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Feedback Summaries & Guide Performance Metrics
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Consolidated evaluation metrics, visitor rating breakdowns, and
              guide quality statistics across all museum tours.
            </p>
          </div>

          <button
            type="button"
            onClick={loadInitialData}
            disabled={isLoadingSummary}
            className="self-start md:self-center flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition backdrop-blur-sm shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingSummary ? "animate-spin" : ""}`}
            />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {error && (
          <div
            role="alert"
            className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadInitialData}
              className="underline font-semibold ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Global Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Reviews Collected
              </p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                {feedbackSummary?.total_reviews_collected ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                System Average Rating
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  {feedbackSummary?.system_average_rating != null
                    ? Number(feedbackSummary.system_average_rating).toFixed(1)
                    : "0.0"}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  / 5.0
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Tour Guides
              </p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                {guides.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tour Performance Summaries Table */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Tour Route Feedback Summaries</span>
              </h2>
              <p className="text-xs text-slate-500">
                Consolidated visitor feedback and ratings for each tour route
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Tour Title</th>
                  <th className="py-3.5 px-4 text-center">Total Reviews</th>
                  <th className="py-3.5 px-4 text-center">Average Rating</th>
                  <th className="py-3.5 px-4">Status / Quality Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feedbackSummary?.tours_summary &&
                feedbackSummary.tours_summary.length > 0 ? (
                  feedbackSummary.tours_summary.map((t) => {
                    const avg = Number(t.average_rating || 0);
                    const total = t.total_reviews || 0;
                    return (
                      <tr
                        key={t.tour_id}
                        className="hover:bg-slate-50/60 transition"
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {t.tour_title}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                          {total}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {total > 0 ? (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-800 font-bold text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{avg.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              No feedback yet
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {total === 0 ? (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                              Pending Initial Reviews
                            </span>
                          ) : avg >= 4.5 ? (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                              Top Rated
                            </span>
                          ) : avg >= 3.5 ? (
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Good Experience
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                              Needs Improvement
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-xs text-slate-400 italic"
                    >
                      No tour feedback summary data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Specific Guide Performance Detail Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Guide Performance Metrics</span>
              </h2>
              <p className="text-xs text-slate-500">
                Detailed metrics, rating distributions, and visitor comments by
                guide
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="guide-selector"
                className="text-xs font-semibold text-slate-600 shrink-0"
              >
                Select Guide:
              </label>
              <select
                id="guide-selector"
                value={selectedGuideId}
                onChange={handleGuideChange}
                className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              >
                {guides.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} {g.specialization ? `(${g.specialization})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingGuide ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading guide metrics...</p>
            </div>
          ) : guideMetrics ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Rating breakdown */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {guideMetrics.guide_name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Assigned Tour Guide
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                      {guideMetrics.total_reviews}{" "}
                      {guideMetrics.total_reviews === 1 ? "Review" : "Reviews"}
                    </div>
                  </div>

                  <RatingBreakdown
                    ratingBreakdown={guideMetrics.rating_breakdown}
                    totalReviews={guideMetrics.total_reviews}
                    averageRating={guideMetrics.average_rating}
                  />
                </div>
              </div>

              {/* Right Column: Recent Visitor Comments */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Recent Visitor Comments</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {guideMetrics.recent_comments?.length || 0} comments
                    recorded
                  </span>
                </div>

                {guideMetrics.total_reviews === 0 ||
                !guideMetrics.recent_comments ||
                guideMetrics.recent_comments.length === 0 ? (
                  <div className="py-12 text-center space-y-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6">
                    <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">
                      No feedback submitted yet
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Reviews will appear here once visitors complete their tour
                      check-in and submit their feedback ratings.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {guideMetrics.recent_comments.map((cmt, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed"
                      >
                        <p className="italic">"{cmt}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <p className="text-xs">
                {guides.length === 0
                  ? "No guides registered in the system yet."
                  : "Select a guide to view their performance metrics."}
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Museum Tour Management System. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
