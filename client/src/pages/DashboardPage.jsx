import React, { useState, useEffect } from "react";
import KPIGrid from "../components/dashboard/KPIGrid";
import EnergyFlowChart from "../components/dashboard/EnergyFlowChart";
import { dashboardService } from "../services/api";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getRealtime();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to load real-time telemetry data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">
            Real-Time Telemetry
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
              : "Connecting to sensors..."}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* KPI Grid */}
      <KPIGrid data={data} />

      {/* Main Flow Chart */}
      <div className="grid grid-cols-1 gap-6">
        <EnergyFlowChart />
      </div>
    </div>
  );
}
