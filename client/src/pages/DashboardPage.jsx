import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import { plotService } from "../services/api";

export default function DashboardPage() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlots() {
      try {
        const data = await plotService.getPlots();
        setPlots(data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlots();
  }, []);

  const totalPlots = plots.length;
  const availablePlots = plots.filter((p) => p.status === "Available").length;
  const reservedPlots = plots.filter((p) => p.status === "Reserved").length;
  const occupiedPlots = plots.filter((p) => p.status === "Occupied").length;

  const availablePercent =
    totalPlots > 0 ? ((availablePlots / totalPlots) * 100).toFixed(1) : 0;
  const reservedPercent =
    totalPlots > 0 ? ((reservedPlots / totalPlots) * 100).toFixed(1) : 0;
  const occupiedPercent =
    totalPlots > 0 ? ((occupiedPlots / totalPlots) * 100).toFixed(1) : 0;

  // Group plots by section for the bar chart
  const sections = ["A", "B", "C", "D", "E", "F"];
  const sectionCounts = sections.reduce((acc, sec) => {
    acc[sec] = plots.filter((p) => p.section?.toUpperCase() === sec).length;
    return acc;
  }, {});
  const maxCount = Math.max(...Object.values(sectionCounts), 1);

  // Group plots by type for the breakdown
  const typeCounts = plots.reduce((acc, p) => {
    const typeName = p.plot_type?.name || "Unknown";
    acc[typeName] = (acc[typeName] || 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout title="Dashboard Overview">
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Row 1: KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Plots */}
        <div className="bg-surface-container-lowest rounded-xl p-6 soft-loom-shadow border border-surface-variant hover:-translate-y-[2px] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-semibold text-outline uppercase tracking-wider">
              Total Plots
            </h3>
            <span className="material-symbols-outlined text-outline">
              landscape
            </span>
          </div>
          <div className="text-3xl font-bold text-on-surface mb-1">
            {loading ? "..." : totalPlots}
          </div>
          <div className="text-outline text-xs">Across all sections</div>
        </div>

        {/* Available Plots */}
        <div className="bg-surface-container-lowest rounded-xl p-6 soft-loom-shadow border border-surface-variant hover:-translate-y-[2px] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-semibold text-outline uppercase tracking-wider">
              Available Plots
            </h3>
            <span className="material-symbols-outlined text-secondary">
              check_circle
            </span>
          </div>
          <div className="text-3xl font-bold text-on-surface mb-1">
            {loading ? "..." : availablePlots}
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-semibold uppercase">
              Available
            </span>
            <div className="text-outline text-xs">
              {availablePercent}% of inventory
            </div>
          </div>
        </div>

        {/* Reserved Plots */}
        <div className="bg-surface-container-lowest rounded-xl p-6 soft-loom-shadow border border-surface-variant hover:-translate-y-[2px] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-semibold text-outline uppercase tracking-wider">
              Reserved Plots
            </h3>
            <span className="material-symbols-outlined text-tertiary-container">
              pending
            </span>
          </div>
          <div className="text-3xl font-bold text-on-surface mb-1">
            {loading ? "..." : reservedPlots}
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-tertiary-container/10 text-tertiary-container text-[10px] font-semibold uppercase">
              Reserved
            </span>
            <div className="text-outline text-xs">
              {reservedPercent}% of inventory
            </div>
          </div>
        </div>

        {/* Occupied Plots */}
        <div className="bg-surface-container-lowest rounded-xl p-6 soft-loom-shadow border border-surface-variant hover:-translate-y-[2px] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-semibold text-outline uppercase tracking-wider">
              Occupied Plots
            </h3>
            <span className="material-symbols-outlined text-outline-variant">
              lock
            </span>
          </div>
          <div className="text-3xl font-bold text-on-surface mb-1">
            {loading ? "..." : occupiedPlots}
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-semibold uppercase">
              Occupied
            </span>
            <div className="text-outline text-xs">
              {occupiedPercent}% of inventory
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bar Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl soft-loom-shadow border border-surface-variant flex flex-col">
          <div className="p-6 border-b border-surface-variant">
            <h2 className="text-lg font-semibold text-on-surface">
              Plots by Section
            </h2>
          </div>
          <div className="p-6 flex-1 min-h-[300px] flex items-end justify-between gap-4">
            {sections.map((sec) => {
              const count = sectionCounts[sec] || 0;
              const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div
                  key={sec}
                  className="flex flex-col items-center gap-2 flex-1 group"
                >
                  <div
                    className="w-full bg-primary-container/20 rounded-t-sm group-hover:bg-primary-container/40 transition-colors relative"
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-outline opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-outline">
                    Sec {sec}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Donut Chart */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl soft-loom-shadow border border-surface-variant flex flex-col">
          <div className="p-6 border-b border-surface-variant">
            <h2 className="text-lg font-semibold text-on-surface">
              Plot Types Breakdown
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center items-center gap-6">
            <div className="w-48 h-48 rounded-full border-[16px] border-primary-container/10 relative flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-on-surface">
                  {totalPlots}
                </div>
                <div className="text-[10px] font-semibold text-outline uppercase tracking-wider">
                  Total
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="w-full grid grid-cols-2 gap-3 text-xs">
              {Object.entries(typeCounts).map(([typeName, count], idx) => (
                <div key={typeName} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      idx === 0
                        ? "bg-primary-container"
                        : idx === 1
                          ? "bg-secondary"
                          : idx === 2
                            ? "bg-tertiary-container"
                            : "bg-outline"
                    }`}
                  ></div>
                  <span className="text-outline font-medium">
                    {typeName} ({count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Data Table */}
      <div className="bg-surface-container-lowest rounded-xl soft-loom-shadow border border-surface-variant overflow-hidden">
        <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-bright">
          <h2 className="text-lg font-semibold text-on-surface">
            Recently Updated Plots
          </h2>
          <button
            onClick={() => navigate("/plots")}
            className="text-primary hover:text-primary-container text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            View All{" "}
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline text-xs font-semibold uppercase tracking-wider border-b border-surface-variant">
                <th className="px-6 py-4">Plot ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-surface-variant">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-outline">
                    Loading...
                  </td>
                </tr>
              ) : plots.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-outline">
                    No plots found.
                  </td>
                </tr>
              ) : (
                plots.slice(0, 5).map((plot) => (
                  <tr
                    key={plot.id}
                    className="hover:bg-surface-bright/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-primary-container font-medium">
                      {plot.plot_id}
                    </td>
                    <td className="px-6 py-4 text-on-surface">
                      {plot.plot_type?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      Sec {plot.section}, Lot {plot.lot}, P{plot.plot_number}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                          plot.status === "Available"
                            ? "bg-secondary/10 text-secondary"
                            : plot.status === "Reserved"
                              ? "bg-tertiary-container/10 text-tertiary-container"
                              : "bg-surface-variant text-on-surface-variant"
                        }`}
                      >
                        {plot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-on-surface">
                      $
                      {plot.price?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-outline font-mono text-right">
                      {new Date(plot.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
