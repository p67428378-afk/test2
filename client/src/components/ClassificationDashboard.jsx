import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, LayoutDashboard, Download } from "lucide-react";
import MetricsOverviewGrid from "./MetricsOverviewGrid";
import FilterToolbar from "./FilterToolbar";
import ClassificationTable from "./ClassificationTable";
import CategoryOverrideModal from "./CategoryOverrideModal";
import { getEmails, overrideCategory, deleteEmail } from "../services/api";

export default function ClassificationDashboard({
  onSwitchToStudio,
  refreshTrigger = 0,
}) {
  const [emails, setEmails] = useState([]);
  const [allEmailsForStats, setAllEmailsForStats] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minConfidence, setMinConfidence] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Selected email for inspection modal
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch paginated & filtered list
  const fetchEmails = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const data = await getEmails({
        category: category !== "All" ? category : undefined,
        min_confidence: minConfidence > 0 ? minConfidence : undefined,
        search: search.trim() || undefined,
        start_date: startDate ? new Date(startDate).toISOString() : undefined,
        end_date: endDate ? new Date(endDate).toISOString() : undefined,
        skip,
        limit,
      });
      setEmails(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load email records.";
      setErrorMsg(
        typeof message === "string" ? message : JSON.stringify(message),
      );
    } finally {
      setIsLoading(false);
    }
  }, [category, minConfidence, search, startDate, endDate, skip, limit]);

  // Fetch global dataset for top stats cards
  const fetchStatsOverview = useCallback(async () => {
    try {
      const data = await getEmails({ limit: 100 });
      setAllEmailsForStats(data.items || []);
    } catch {
      // stats error is non-blocking
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails, refreshTrigger]);

  useEffect(() => {
    fetchStatsOverview();
  }, [fetchStatsOverview, refreshTrigger]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setMinConfidence(0);
    setStartDate("");
    setEndDate("");
    setSkip(0);
  };

  const handleInspect = (email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const handleInlineOverride = async (emailId, newCategory) => {
    try {
      const updated = await overrideCategory(emailId, newCategory);
      setEmails((prev) =>
        prev.map((item) => (item.id === emailId ? updated : item)),
      );
      fetchStatsOverview();
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to update category.";
      alert(typeof message === "string" ? message : JSON.stringify(message));
    }
  };

  const handleModalUpdated = (updatedEmail) => {
    setEmails((prev) =>
      prev.map((item) => (item.id === updatedEmail.id ? updatedEmail : item)),
    );
    setSelectedEmail(updatedEmail);
    fetchStatsOverview();
  };

  const handleDelete = async (emailId) => {
    if (!window.confirm("Are you sure you want to delete this email record?")) {
      return;
    }
    try {
      await deleteEmail(emailId);
      fetchEmails();
      fetchStatsOverview();
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to delete email record.";
      alert(typeof message === "string" ? message : JSON.stringify(message));
    }
  };

  const handleExportCSV = () => {
    if (emails.length === 0) return;
    const headers = [
      "ID",
      "Sender",
      "Subject",
      "Source Type",
      "Category",
      "Confidence",
      "Overridden",
      "Date",
    ];
    const rows = emails.map((e) => [
      e.id,
      `"${e.sender || ""}"`,
      `"${(e.subject || "").replace(/"/g, '""')}"`,
      e.source_type,
      e.classification?.user_override_category ||
        e.classification?.primary_category ||
        "",
      e.classification?.confidence_score || 0,
      e.classification?.is_overridden ? "Yes" : "No",
      e.created_at,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `email_classifications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            Email Classification Review Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit AI categorization outputs, inspect RFC extracts, filter by
            threshold, and apply manual category overrides.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={emails.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              fetchEmails();
              fetchStatsOverview();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <MetricsOverviewGrid
        emails={allEmailsForStats.length > 0 ? allEmailsForStats : emails}
        activeCategory={category}
        onSelectCategory={(cat) => {
          setCategory(cat);
          setSkip(0);
        }}
      />

      {/* Filter Toolbar */}
      <FilterToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setSkip(0);
        }}
        category={category}
        onCategoryChange={(cat) => {
          setCategory(cat);
          setSkip(0);
        }}
        minConfidence={minConfidence}
        onMinConfidenceChange={(val) => {
          setMinConfidence(val);
          setSkip(0);
        }}
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val);
          setSkip(0);
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val);
          setSkip(0);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Error Message if API fails */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm">
          <strong>Error loading emails:</strong> {errorMsg}
        </div>
      )}

      {/* Classification Data Table */}
      <ClassificationTable
        emails={emails}
        total={total}
        skip={skip}
        limit={limit}
        isLoading={isLoading}
        onPageChange={(newSkip) => setSkip(Math.max(0, newSkip))}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setSkip(0);
        }}
        onInspectEmail={handleInspect}
        onInlineOverride={handleInlineOverride}
        onDeleteEmail={handleDelete}
      />

      {/* Category Override Detail Modal */}
      <CategoryOverrideModal
        email={selectedEmail}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdated={handleModalUpdated}
      />
    </div>
  );
}
