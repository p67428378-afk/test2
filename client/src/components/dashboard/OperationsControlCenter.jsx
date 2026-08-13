import React, { useEffect, useState } from "react";
import { Users, QrCode, UserCheck, Music2, RefreshCw } from "lucide-react";
import { getCrowdDensity } from "../../services/api";
import StageOccupancyHeatmap from "./StageOccupancyHeatmap";
import LiveTelemetryStream from "./LiveTelemetryStream";

export default function OperationsControlCenter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCrowdDensity();
      setData(res);
    } catch (err) {
      console.error("Failed to fetch crowd metrics", err);
      setError("Could not load operational telemetry from backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const kpis = [
    {
      title: "Total Attendees Inside",
      value: data?.total_attendees?.toLocaleString() || "0",
      icon: Users,
      color: "text-indigo-400",
      border: "border-indigo-500/20",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Active Scans / Min",
      value: data?.active_scans_per_min || "0",
      icon: QrCode,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Active Volunteers On Duty",
      value: data?.active_volunteers || "0",
      icon: UserCheck,
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
    },
    {
      title: "Active Festival Stages",
      value: data?.active_stages || "0",
      icon: Music2,
      color: "text-sky-400",
      border: "border-sky-500/20",
      bg: "bg-sky-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header / Title bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Operations Control Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time crowd analytics, stage heatmaps, and live gate throughput
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="self-start md:self-auto flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`bg-slate-900 border ${kpi.border} rounded-2xl p-5 shadow-lg flex items-center space-x-4`}
            >
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <Icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {kpi.title}
                </p>
                <p className="text-2xl font-extrabold text-white mt-0.5">
                  {kpi.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap & Telemetry Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StageOccupancyHeatmap stages={data?.stages || []} />
        </div>
        <div className="lg:col-span-1">
          <LiveTelemetryStream />
        </div>
      </div>
    </div>
  );
}
