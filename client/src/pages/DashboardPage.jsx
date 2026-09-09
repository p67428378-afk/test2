import React, { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard.jsx";
import WateringAlertCard from "../components/dashboard/WateringAlertCard.jsx";
import ScheduleTable from "../components/dashboard/ScheduleTable.jsx";
import {
  getDashboardSchedules,
  waterUserPlant,
  triggerReminderNotifications,
} from "../services/api.js";
import {
  Droplet,
  AlertTriangle,
  CheckCircle,
  Award,
  Send,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage({ onAlertsCountChange }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notificationStatus, setNotificationStatus] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDashboardSchedules();
      setDashboardData(data);

      const totalAlerts =
        (data?.overdue?.length || 0) + (data?.due_today?.length || 0);
      if (onAlertsCountChange) onAlertsCountChange(totalAlerts);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.detail || "Failed to load dashboard care data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleWaterPlant = async (plantId) => {
    await waterUserPlant(plantId);
    await fetchDashboard();
  };

  const handleTriggerDailyReminders = async () => {
    setNotificationStatus("");
    setIsSendingNotification(true);
    try {
      const res = await triggerReminderNotifications();
      setNotificationStatus(
        `Sent ${res.total_alerts || 0} reminder notifications!`,
      );
      setTimeout(() => setNotificationStatus(""), 4000);
    } catch (err) {
      setNotificationStatus(
        err.response?.data?.detail ||
          "Failed to trigger reminder notifications.",
      );
    } finally {
      setIsSendingNotification(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center py-20">
        <RefreshCw className="w-8 h-8 text-[#1C8A5C] animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-600">
          Loading houseplant care dashboard...
        </p>
      </div>
    );
  }

  const stats = dashboardData?.summary_stats || {
    overdue_count: dashboardData?.overdue?.length || 0,
    due_today_count: dashboardData?.due_today?.length || 0,
    total_plants: 0,
    healthy_count: 0,
    care_score: 100,
  };

  const urgentPlants = [
    ...(dashboardData?.overdue || []),
    ...(dashboardData?.due_today || []),
  ];
  const allPlantsList = [
    ...(dashboardData?.overdue || []),
    ...(dashboardData?.due_today || []),
    ...(dashboardData?.upcoming || []),
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🌿 Houseplant Care Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor watering schedules, pending alerts, and care health metrics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerDailyReminders}
            disabled={isSendingNotification}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-[#1C8A5C] border border-[#1C8A5C]/20 hover:bg-[#1C8A5C] hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {isSendingNotification
                ? "Dispatching..."
                : "Trigger Daily Summary (9:00 AM)"}
            </span>
          </button>

          <button
            onClick={fetchDashboard}
            className="p-2 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {notificationStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>{notificationStatus}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Core Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overdue Waterings"
          value={`${stats.overdue_count} ${stats.overdue_count === 1 ? "Plant" : "Plants"}`}
          badgeText={
            stats.overdue_count > 0
              ? `Action Needed (${stats.overdue_count})`
              : "All Caught Up"
          }
          badgeType={stats.overdue_count > 0 ? "danger" : "success"}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
        <StatCard
          title="Due Today"
          value={`${stats.due_today_count} ${stats.due_today_count === 1 ? "Plant" : "Plants"}`}
          badgeText={
            stats.due_today_count > 0 ? "Water Today" : "No Tasks Today"
          }
          badgeType={stats.due_today_count > 0 ? "warning" : "success"}
          icon={<Droplet className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="My Garden Total"
          value={`${stats.total_plants} ${stats.total_plants === 1 ? "Plant" : "Plants"}`}
          badgeText={`${stats.healthy_count} Healthy`}
          badgeType="success"
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Weekly Care Score"
          value={`${stats.care_score}%`}
          badgeText={
            stats.care_score >= 80 ? "Excellent Care" : "Needs Attention"
          }
          badgeType={stats.care_score >= 80 ? "success" : "warning"}
          icon={<Award className="w-5 h-5 text-indigo-500" />}
        />
      </div>

      {/* Immediate Watering Alerts Grid */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>🚨</span> Immediate Care & Watering Alerts
            </h2>
            <p className="text-xs text-gray-500">
              Plants requiring immediate attention or scheduled for today
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded-full">
            {urgentPlants.length} Pending
          </span>
        </div>

        {urgentPlants.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-medium text-emerald-700">
              🌱 All plants are well hydrated!
            </p>
            <p className="text-xs text-gray-500 mt-1">
              No overdue or immediate watering tasks currently required.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentPlants.map((plant) => (
              <WateringAlertCard
                key={plant.id}
                plant={plant}
                onWaterSuccess={handleWaterPlant}
              />
            ))}
          </div>
        )}
      </div>

      {/* 7-Day Watering Schedule Table */}
      <ScheduleTable plants={allPlantsList} onWaterPlant={handleWaterPlant} />
    </div>
  );
}
