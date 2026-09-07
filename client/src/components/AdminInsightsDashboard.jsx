import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Download,
  RefreshCw,
  AlertTriangle,
  Layers,
  ShieldCheck,
} from "lucide-react";
import {
  getAdminInsights,
  listAdminFeedback,
  listAdminAlerts,
  exportAdminCsv,
} from "../services/api";
import SentimentBreakdownChart from "./SentimentBreakdownChart";
import TopTopicsWidget from "./TopTopicsWidget";
import FeedbackFilterTable from "./FeedbackFilterTable";

export default function AdminInsightsDashboard() {
  const [timeframe, setTimeframe] = useState("30d");
  const [insights, setInsights] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    items: [],
    total: 0,
    skip: 0,
    limit: 10,
  });
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilterState] = useState({
    sentiment: "",
    rating: "",
    search: "",
    skip: 0,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [insightsRes, listRes, alertsRes] = await Promise.allSettled([
        getAdminInsights(timeframe),
        listAdminFeedback({
          skip: filters.skip,
          limit: filters.limit,
          sentiment: filters.sentiment || undefined,
          rating: filters.rating ? parseInt(filters.rating, 10) : undefined,
          search: filters.search || undefined,
        }),
        listAdminAlerts({ limit: 10 }),
      ]);

      if (insightsRes.status === "fulfilled") {
        setInsights(insightsRes.value);
      } else {
        console.warn("Insights request failed:", insightsRes.reason);
      }

      if (listRes.status === "fulfilled") {
        setFeedbackData(listRes.value);
      } else {
        console.warn("Feedback list request failed:", listRes.reason);
      }

      if (alertsRes.status === "fulfilled") {
        setAlerts(alertsRes.value || []);
      }
    } catch (err) {
      console.error("Failed to load admin insights data:", err);
      setError("Error connecting to backend insights service.");
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportAdminCsv({ timeframe });
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/csv" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `feedback_insights_${timeframe}_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);
      alert("Failed to generate CSV export.");
    } finally {
      setIsExporting(false);
    }
  };

  const stats = [
    {
      label: "Total Feedback",
      value: insights?.total_feedback?.toLocaleString() ?? "0",
      icon: MessageSquare,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Avg Rating",
      value: insights?.avg_rating
        ? `${insights.avg_rating.toFixed(1)} / 5.0`
        : "0.0 / 5.0",
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Positive Sentiment",
      value: `${insights?.sentiment_distribution?.positive_percentage?.toFixed(1) ?? "0.0"}%`,
      icon: ThumbsUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Negative Sentiment",
      value: `${insights?.sentiment_distribution?.negative_percentage?.toFixed(1) ?? "0.0"}%`,
      icon: ThumbsDown,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      <aside className="w-64 border-r border-slate-800 bg-slate-950 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">Insights Admin</span>
          </div>

          <nav className="space-y-1">
            <a
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 bg-indigo-600/10 text-indigo-400 font-medium rounded-xl text-sm border border-indigo-500/20"
            >
              <BarChart3 className="w-4 h-4" /> Overview Dashboard
            </a>
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl text-sm transition"
            >
              <MessageSquare className="w-4 h-4" /> Feedback Form
            </a>
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Admin Authenticated</span>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> JWT
          </span>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Customer Feedback Insights
            </h1>
            <p className="text-sm text-slate-400">
              Real-time AI sentiment analysis & issue classification
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-2 transition"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              Refresh
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </header>

        {alerts.length > 0 && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-rose-400">
                Active Critical Alerts ({alerts.length})
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Negative customer feedback or low star ratings have triggered
                real-time notifications.
              </p>
            </div>
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
              distribution={insights?.sentiment_distribution}
            />
          </div>
          <div className="lg:col-span-2">
            <TopTopicsWidget topics={insights?.top_topics} />
          </div>
        </div>

        <div>
          <FeedbackFilterTable
            feedbackList={feedbackData.items}
            total={feedbackData.total}
            skip={feedbackData.skip}
            limit={feedbackData.limit}
            sentimentFilter={filters.sentiment}
            ratingFilter={filters.rating}
            searchQuery={filters.search}
            isLoading={isLoading}
            onFilterChange={(newFilters) =>
              setFilterState((prev) => ({ ...prev, ...newFilters }))
            }
            onPageChange={(newSkip) =>
              setFilterState((prev) => ({ ...prev, skip: newSkip }))
            }
          />
        </div>
      </main>
    </div>
  );
}
