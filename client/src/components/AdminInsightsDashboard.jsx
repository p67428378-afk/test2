import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  RefreshCw,
  Download,
  Star,
  Layers,
  LogOut,
} from "lucide-react";
import {
  getAdminInsights,
  getAdminFeedback,
  reanalyzeFeedback,
} from "../services/api";
import SentimentBreakdownChart from "./SentimentBreakdownChart";
import TopTopicsWidget from "./TopTopicsWidget";
import FeedbackFilterTable from "./FeedbackFilterTable";

export default function AdminInsightsDashboard({ onLogout, onNavigateHome }) {
  const [insights, setInsights] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    items: [],
    total: 0,
    skip: 0,
    limit: 20,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reanalyzingId, setReanalyzingId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [insightsRes, feedbackRes] = await Promise.all([
        getAdminInsights(),
        getAdminFeedback({
          skip: 0,
          limit: 50,
          sentiment: sentimentFilter || undefined,
          rating: ratingFilter ? parseInt(ratingFilter, 10) : undefined,
          search: searchQuery.trim() || undefined,
        }),
      ]);
      setInsights(insightsRes);
      setFeedbackData(feedbackRes);
    } catch (err) {
      console.error("Failed to load dashboard insights:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          "Authentication required or token expired. Please log in again.",
        );
      } else {
        setError(
          "Failed to connect to backend server. Make sure the API service is running.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [sentimentFilter, ratingFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReanalyze = async (feedbackId) => {
    setReanalyzingId(feedbackId);
    try {
      await reanalyzeFeedback(feedbackId);
      await fetchData();
    } catch (err) {
      console.error("Reanalyze error:", err);
    } finally {
      setReanalyzingId(null);
    }
  };

  const handleExportCSV = () => {
    if (!feedbackData.items || feedbackData.items.length === 0) return;
    const headers = [
      "ID",
      "Date",
      "Customer Email",
      "Rating",
      "Sentiment",
      "Topics",
      "Feedback Text",
    ];
    const rows = feedbackData.items.map((item) => [
      item.id,
      item.created_at,
      item.customer_email || "Anonymous",
      item.rating,
      item.sentiment_analysis?.sentiment || "Pending",
      (item.topics || []).map((t) => t.topic_name).join("; "),
      `"${(item.feedback_text || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `feedback_insights_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFeedback = insights?.total_feedback ?? feedbackData.total ?? 0;
  const avgRating = insights?.avg_rating
    ? insights.avg_rating.toFixed(1)
    : "0.0";
  const posPct = insights?.sentiment_distribution?.positive_percentage
    ? `${Math.round(insights.sentiment_distribution.positive_percentage)}%`
    : "0%";
  const negPct = insights?.sentiment_distribution?.negative_percentage
    ? `${Math.round(insights.sentiment_distribution.negative_percentage)}%`
    : "0%";

  const stats = [
    {
      label: "Total Feedback",
      value: totalFeedback,
      icon: MessageSquare,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Avg Rating",
      value: `${avgRating} / 5.0`,
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Positive Sentiment",
      value: posPct,
      icon: ThumbsUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Negative Sentiment",
      value: negPct,
      icon: ThumbsDown,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      <aside className="w-64 border-r border-slate-800 bg-slate-950 p-6 flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">Insights Admin</span>
          </div>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-600/10 text-indigo-400 font-medium rounded-xl text-sm border border-indigo-500/20 text-left">
              <BarChart3 className="w-4 h-4" /> Overview Dashboard
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl text-sm transition text-left"
            >
              <MessageSquare className="w-4 h-4" /> Public Submission
            </button>
          </nav>
        </div>
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500">
          <div>
            <div className="text-slate-300 font-medium">Logged in as Admin</div>
            <div className="text-[10px] text-emerald-400 font-mono">
              JWT Verified
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Customer Feedback Insights
            </h1>
            <p className="text-sm text-slate-400">
              Real-time AI sentiment analysis & common issue classification
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              Refresh Data
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export Insights
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex justify-between items-center"
          >
            <span>{error}</span>
            <button
              onClick={onLogout}
              className="text-xs bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1 rounded-lg transition font-medium"
            >
              Re-authenticate
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {s.label}
                  </span>
                  <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {s.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <SentimentBreakdownChart
              distribution={insights?.sentiment_distribution || {}}
            />
          </div>
          <div className="lg:col-span-2">
            <TopTopicsWidget topics={insights?.top_topics || []} />
          </div>
        </div>

        <FeedbackFilterTable
          feedbackList={feedbackData.items}
          total={feedbackData.total}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sentimentFilter={sentimentFilter}
          onSentimentChange={setSentimentFilter}
          ratingFilter={ratingFilter}
          onRatingChange={setRatingFilter}
          onReanalyze={handleReanalyze}
          reanalyzingId={reanalyzingId}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
