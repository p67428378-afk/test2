import React, { useState, useEffect } from "react";
import { getCrowdAnalytics, ingestCrowdTelemetry } from "../../services/api";
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Users,
  RefreshCw,
  Radio,
  Send,
} from "lucide-react";

export const CrowdAnalyticsDashboard = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Telemetry simulator form state
  const [simZone, setSimZone] = useState("zone-main-stage");
  const [simSensor, setSimSensor] = useState("sensor-01");
  const [simOccupancy, setSimOccupancy] = useState(8800);
  const [simIngress, setSimIngress] = useState(1200);
  const [simEgress, setSimEgress] = useState(50);
  const [simStatusMsg, setSimStatusMsg] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const data = await getCrowdAnalytics();
      setZones(data || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load crowd analytics:", err);
      setError("Unable to fetch live crowd analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateTelemetry = async (e) => {
    e.preventDefault();
    setSimStatusMsg(null);
    try {
      const payload = {
        zone_id: simZone,
        sensor_id: simSensor,
        ingress_count: Number(simIngress),
        egress_count: Number(simEgress),
        current_occupancy: Number(simOccupancy),
        timestamp: new Date().toISOString(),
      };
      await ingestCrowdTelemetry(payload);
      setSimStatusMsg({
        type: "success",
        text: `Telemetry ingested for ${simZone}. Updating metrics...`,
      });
      await fetchAnalytics();
    } catch (err) {
      console.error("Telemetry ingestion failed:", err);
      setSimStatusMsg({
        type: "error",
        text: "Telemetry ingestion failed. Check backend logs.",
      });
    }
  };

  const getStatusBadge = (densityStatus, rateAlert, pct) => {
    if (densityStatus === "CRITICAL" || pct >= 95) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>95%+ CRITICAL</span>
        </span>
      );
    }
    if (densityStatus === "WARNING" || pct >= 85) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>85%+ WARNING</span>
        </span>
      );
    }
    if (rateAlert) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>RAPID INFLUX</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        NORMAL
      </span>
    );
  };

  const totalCapacity = zones.reduce(
    (acc, z) => acc + (z.max_capacity || 0),
    0,
  );
  const totalOccupancy = zones.reduce(
    (acc, z) => acc + (z.current_occupancy || 0),
    0,
  );
  const criticalZonesCount = zones.filter(
    (z) =>
      z.density_status === "CRITICAL" || (z.occupancy_percentage || 0) >= 95,
  ).length;
  const warningZonesCount = zones.filter(
    (z) =>
      z.density_status === "WARNING" ||
      ((z.occupancy_percentage || 0) >= 85 &&
        (z.occupancy_percentage || 0) < 95),
  ).length;
  const rapidInfluxCount = zones.filter((z) => z.rate_of_change_alert).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center space-x-3">
            <Activity className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">
              Real-Time Crowd Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Live telemetry, capacity threshold alerts (85% Yellow / 95% Red),
            and rate-of-change influx detection.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <span className="text-xs text-slate-400">
              Refreshed: {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchAnalytics}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-medium transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Occupancy
            </span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalOccupancy.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            out of {totalCapacity.toLocaleString()} max capacity
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              85% Warning Zones
            </span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">
            {warningZonesCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            High density monitoring active
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              95% Critical Alerts
            </span>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">
            {criticalZonesCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Security redirect recommended
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="flex items-center justify-between text-violet-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Rapid Influx Alerts
            </span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-violet-300">
            {rapidInfluxCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            &gt;1,000 arrivals in &lt;2 minutes
          </div>
        </div>
      </div>

      {/* Zone Occupancy List */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Radio className="w-5 h-5 text-indigo-400" />
          <span>Festival Zone Density Monitor</span>
        </h2>

        {loading && zones.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Loading live zone metrics...
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No zone analytics data returned from API. Inject telemetry below to
            populate live status.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => {
              const pct =
                zone.occupancy_percentage ||
                (zone.max_capacity
                  ? Math.round(
                      (zone.current_occupancy / zone.max_capacity) * 100,
                    )
                  : 0);
              const isCritical =
                zone.density_status === "CRITICAL" || pct >= 95;
              const isWarning =
                zone.density_status === "WARNING" || (pct >= 85 && pct < 95);

              return (
                <div
                  key={zone.zone_id || zone.zone_name}
                  className={`p-5 rounded-xl border transition-all ${
                    isCritical
                      ? "bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-900/10"
                      : isWarning
                        ? "bg-amber-950/20 border-amber-500/40"
                        : "bg-slate-800/80 border-slate-700/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {zone.zone_name || zone.zone_id}
                      </h3>
                      <span className="text-xs text-slate-400">
                        ID: {zone.zone_id}
                      </span>
                    </div>
                    {getStatusBadge(
                      zone.density_status,
                      zone.rate_of_change_alert,
                      pct,
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>
                        Occupancy: {zone.current_occupancy?.toLocaleString()} /{" "}
                        {zone.max_capacity?.toLocaleString()}
                      </span>
                      <span className="font-bold">{pct.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700/60 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCritical
                            ? "bg-rose-500"
                            : isWarning
                              ? "bg-amber-500"
                              : "bg-indigo-500"
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/40">
                    <span>
                      2-Min Flow Rate:{" "}
                      <strong
                        className={
                          zone.rate_of_change_2min > 1000
                            ? "text-violet-300 font-bold"
                            : "text-slate-200"
                        }
                      >
                        +{zone.rate_of_change_2min || 0}
                      </strong>
                    </span>
                    {zone.rate_of_change_alert && (
                      <span className="text-violet-300 font-semibold flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Rapid Influx Triggered</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Telemetry Simulator Form */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Send className="w-5 h-5 text-indigo-400" />
            <span>Simulate Live Telemetry Ingestion</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Send sensor event payload to test 85% Warning, 95% Critical, and
            Rapid Influx alerts in real time.
          </p>
        </div>

        {simStatusMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${
              simStatusMsg.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
            }`}
          >
            {simStatusMsg.text}
          </div>
        )}

        <form
          onSubmit={handleSimulateTelemetry}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Zone ID
            </label>
            <input
              type="text"
              value={simZone}
              onChange={(e) => setSimZone(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Sensor ID
            </label>
            <input
              type="text"
              value={simSensor}
              onChange={(e) => setSimSensor(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Occupancy
            </label>
            <input
              type="number"
              value={simOccupancy}
              onChange={(e) => setSimOccupancy(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ingress Count (2-min)
            </label>
            <input
              type="number"
              value={simIngress}
              onChange={(e) => setSimIngress(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Egress Count
            </label>
            <input
              type="number"
              value={simEgress}
              onChange={(e) => setSimEgress(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20"
            >
              Ingest Sensor Telemetry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
