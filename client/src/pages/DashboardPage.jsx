import React, { useState, useEffect } from "react";
import {
  Download,
  Plus,
  DollarSign,
  Activity,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard.jsx";
import CostTrendChart from "../components/dashboard/CostTrendChart.jsx";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown.jsx";
import MaintenanceEventModal from "../components/logs/MaintenanceEventModal.jsx";
import Button from "../components/common/Button.jsx";
import api from "../services/api.js";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCostSummary();
      setSummary(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load dashboard metrics",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleCreateEvent = async (payload) => {
    await api.createMaintenanceEvent(payload);
    await fetchSummary();
  };

  const handleExportCsv = async () => {
    try {
      const blob = await api.exportMaintenanceCsv();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "wifi_maintenance_export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Failed to export CSV report");
    }
  };

  const totalSpend = summary?.total_spend || 0;
  const totalEvents = summary?.total_events || 0;
  const avgCost = totalEvents > 0 ? totalSpend / totalEvents : 0;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-6 px-4 md:px-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171c29]">
            Cost Analytics & Overview
          </h1>
          <p className="text-sm text-[#707a8c] mt-0.5">
            Track infrastructure maintenance expenses, uptime events, and
            regional breakdowns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={handleExportCsv}>
            Export CSV
          </Button>
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            Record New Event
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#dc2626] p-4 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={fetchSummary}
          >
            Retry
          </Button>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Spend (YTD)"
          value={`$${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          badgeText={totalEvents > 0 ? "+Active" : "No Spend"}
          badgeVariant={totalEvents > 0 ? "success" : "warning"}
          icon={DollarSign}
        />
        <StatCard
          title="Total Events Logged"
          value={`${totalEvents} Event${totalEvents === 1 ? "" : "s"}`}
          badgeText={totalEvents > 0 ? "Recorded" : "Empty"}
          badgeVariant={totalEvents > 0 ? "primary" : "default"}
          icon={Activity}
        />
        <StatCard
          title="Average Event Cost"
          value={`$${avgCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          badgeText="Avg / Event"
          badgeVariant="default"
          icon={DollarSign}
        />
      </div>

      {loading ? (
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#2663eb] border-t-transparent mb-3" />
          <p className="text-sm text-[#707a8c]">Loading dashboard charts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CostTrendChart monthlyTrends={summary?.monthly_trends || []} />
          </div>
          <div>
            <CategoryBreakdown
              costByType={summary?.cost_by_type || {}}
              costByLocation={summary?.cost_by_location || {}}
            />
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      <MaintenanceEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateEvent}
      />
    </div>
  );
}
