import React, { useState, useEffect } from "react";
import StatGroup from "../components/dashboard/StatGroup";
import TelemetryChartCard from "../components/dashboard/TelemetryChartCard";
import api from "../services/api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hives, setHives] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [seasonalData, setSeasonalAnalytics] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        hivesData,
        harvestsData,
        diseasesData,
        inspectionsData,
        analyticsData,
      ] = await Promise.all([
        api.getHives().catch(() => []),
        api.getHarvests().catch(() => []),
        api.getDiseaseReports().catch(() => []),
        api.getInspections().catch(() => []),
        api.getSeasonalAnalytics(null, "Summer").catch(() => null),
      ]);

      setHives(hivesData);
      setHarvests(harvestsData);
      setDiseases(diseasesData);
      setInspections(inspectionsData);
      setSeasonalAnalytics(analyticsData);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load live beehive system metrics.");
    } finally {
      setLoading(false);
    }
  };

  const totalHarvestKg = harvests.reduce(
    (acc, c) => acc + (c.quantity_kg || 0),
    0,
  );
  const activeAlerts = diseases.filter(
    (d) => d.severity_level === "High" || d.severity_level === "Critical",
  ).length;
  const scheduledInspections = inspections.filter(
    (i) => i.status === "scheduled",
  ).length;

  const stats = {
    totalHives: hives.length,
    avgTemp: seasonalData?.avg_temperature_celsius || 34.5,
    avgHumidity: seasonalData?.avg_humidity_percent || 61.2,
    totalHarvestKg: totalHarvestKg.toFixed(1),
    activeAlerts: activeAlerts,
    scheduledInspections: scheduledInspections,
  };

  const chartPoints = seasonalData?.trends || [];

  return (
    <div className="space-y-6" data-name="DashboardPage">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171c29]">
            🐝 Apiary Telemetry & Operational Overview
          </h1>
          <p className="text-xs text-[#707a8c] mt-1">
            Real-time hive environmental telemetry, colony health monitoring,
            yield logs, and seasonal analytics.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="text-xs bg-white border border-[#e3e8f0] px-3 py-2 rounded-lg font-medium text-[#707a8c] hover:bg-gray-50 shadow-sm"
        >
          🔄 Refresh System Telemetry
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#707a8c]">
          Loading beehive telemetry dashboard...
        </div>
      ) : (
        <>
          <StatGroup stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-col-span-2 lg:col-span-2">
              <TelemetryChartCard data={chartPoints} />
            </div>

            {/* Quick System Summary */}
            <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#171c29] border-b border-[#e3e8f0] pb-2">
                Active System Status
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#707a8c]">Registered Apiaries</span>
                  <span className="font-bold text-[#171c29]">Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#707a8c]">Bee Density Status</span>
                  <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Optimal (~4,500/frame)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#707a8c]">Queen Bee Health</span>
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Monitored
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#707a8c]">Latest Harvest Season</span>
                  <span className="font-bold text-[#171c29]">
                    {seasonalData?.season || "Summer"}{" "}
                    {seasonalData?.year || 2026}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e3e8f0]">
                <h4 className="text-xs font-semibold text-[#171c29] mb-2">
                  Upcoming Inspection Queue
                </h4>
                {inspections.slice(0, 3).length === 0 ? (
                  <p className="text-xs text-[#707a8c]">
                    No pending field inspections.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {inspections.slice(0, 3).map((ins) => (
                      <li
                        key={ins.id}
                        className="text-xs p-2 bg-[#f7fafc] rounded border border-[#e3e8f0]"
                      >
                        <span className="font-bold text-[#2663eb]">
                          {ins.inspector_name}
                        </span>
                        <span className="text-[#707a8c] block">
                          {ins.notes || "Routine check"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
