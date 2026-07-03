import React, { useState, useEffect } from "react";
import {
  Sun,
  Battery,
  Zap,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import KPICard from "../components/dashboard/KPICard.jsx";
import EnergyChart from "../components/dashboard/EnergyChart.jsx";
import UsageDonut from "../components/dashboard/UsageDonut.jsx";
import Badge from "../components/common/Badge.jsx";
import Table from "../components/common/Table.jsx";
import Button from "../components/common/Button.jsx";
import { systemService, alertService } from "../services/api.js";

export default function SolarOwnerDashboard({ activeTab, setActiveTab }) {
  const [realtime, setRealtime] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Hardcoded system ID for demo/owner purposes
  const SYSTEM_ID = "00000000-0000-0000-0000-000000000000";

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const [realtimeData, analyticsData, alertsData] = await Promise.all([
        systemService.getRealtime(SYSTEM_ID),
        systemService.getAnalytics(SYSTEM_ID, period),
        alertService.getAlerts(),
      ]);

      setRealtime(realtimeData);
      setAnalytics(analyticsData);
      setAlerts(alertsData);
    } catch (err) {
      console.error("Error fetching owner dashboard data:", err);
      setError(
        "Failed to load system data. Please ensure the backend is running.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 15 seconds as per requirements
    const interval = setInterval(() => {
      fetchData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [period]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p className="text-slate-500 text-sm font-medium">
          Loading solar system metrics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center max-w-lg mx-auto my-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Dashboard Error
        </h3>
        <p className="text-red-600 text-sm mb-6">{error}</p>
        <Button
          onClick={() => fetchData()}
          variant="danger"
          className="mx-auto"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  const activeAlerts = alerts.filter((a) => !a.is_resolved);

  return (
    <div className="space-y-8">
      {/* Top Bar / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Solar System Overview
          </h1>
          <p className="text-sm text-slate-500">
            Real-time monitoring and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            {["daily", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                  period === p
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button
            onClick={() => fetchData(true)}
            variant="outline"
            disabled={refreshing}
            className="p-2.5"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Current Power"
          value={realtime?.current_power_kw?.toFixed(2) || "0.00"}
          unit="kW"
          icon={Zap}
          trend={realtime?.status === "Online" ? "Optimal" : "Check System"}
          trendType={realtime?.status === "Online" ? "positive" : "negative"}
          description="Current instantaneous generation"
        />
        <KPICard
          title="Today Generation"
          value={realtime?.today_generation_kwh?.toFixed(1) || "0.0"}
          unit="kWh"
          icon={Sun}
          trend="Accumulating"
          trendType="neutral"
          description="Total energy generated today"
        />
        <KPICard
          title="System Efficiency"
          value={realtime?.efficiency_pct?.toFixed(1) || "0.0"}
          unit="%"
          icon={Battery}
          trend={realtime?.efficiency_pct > 80 ? "High" : "Normal"}
          trendType={realtime?.efficiency_pct > 80 ? "positive" : "neutral"}
          description="Panel conversion efficiency"
        />
        <KPICard
          title="Active Alerts"
          value={activeAlerts.length}
          icon={AlertTriangle}
          trend={activeAlerts.length > 0 ? "Action Required" : "All Clear"}
          trendType={activeAlerts.length > 0 ? "negative" : "positive"}
          description="Unresolved maintenance alerts"
        />
      </div>

      {/* Main Content Tabs */}
      {activeTab === "dashboard" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2">
            <EnergyChart data={analytics?.generation_data || []} />
          </div>
          {/* Donut / Distribution */}
          <div>
            <UsageDonut usage={analytics?.usage_breakdown || {}} />
          </div>
        </div>
      ) : (
        /* Alerts Tab */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              System Alerts
            </h3>
            <p className="text-xs text-slate-500">
              Maintenance and performance notifications
            </p>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <p className="font-medium text-slate-700">No alerts detected</p>
              <p className="text-xs text-slate-400 mt-1">
                Your solar system is operating perfectly.
              </p>
            </div>
          ) : (
            <Table
              headers={["Severity", "Description", "Date Triggered", "Status"]}
            >
              {alerts.map((alert) => (
                <tr
                  key={alert.alert_id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        alert.severity === "Critical"
                          ? "danger"
                          : alert.severity === "Medium"
                            ? "warning"
                            : "info"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {alert.description}
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {new Date(alert.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={alert.is_resolved ? "success" : "warning"}>
                      {alert.is_resolved ? "Resolved" : "Active"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      )}
    </div>
  );
}
