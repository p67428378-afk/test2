import React, { useState, useEffect } from "react";
import KPIGrid from "../components/admin/KPIGrid.jsx";
import RouteTable from "../components/admin/RouteTable.jsx";
import RouteDetail from "./RouteDetail.jsx";
import { busService } from "../services/api.js";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [stats, setStats] = useState({
    activeBuses: 0,
    totalRoutes: 0,
    activeStops: 0,
    status: "Healthy",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const routesData = await busService.getRoutes();
      setRoutes(routesData);

      // Calculate stats
      let totalBuses = 0;
      let totalStops = 0;
      const stopIds = new Set();

      // Fetch details for each route to aggregate stats
      const detailsPromises = routesData.map(async (route) => {
        try {
          const [stopsData, busesData] = await Promise.all([
            busService.getRouteStops(route.id),
            busService.getRouteBuses(route.id),
          ]);
          stopsData.forEach((s) => stopIds.add(s.id));
          totalBuses += busesData.length;
        } catch (err) {
          console.error(`Failed to fetch details for route ${route.id}:`, err);
        }
      });

      await Promise.all(detailsPromises);

      setStats({
        activeBuses: totalBuses,
        totalRoutes: routesData.length,
        activeStops: stopIds.size,
        status: "Healthy",
      });

      setError(null);
    } catch (err) {
      setError("Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (selectedRouteId) {
    return (
      <RouteDetail
        routeId={selectedRouteId}
        onBack={() => setSelectedRouteId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-slate-100">
            Admin Route Manager
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage transit routes, monitor active fleet, and view system health.
          </p>
        </div>
        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-slate-100 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-600/10 self-end sm:self-auto"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Dashboard
        </button>
      </div>

      {/* KPI Grid */}
      <KPIGrid stats={stats} />

      {/* Route Table */}
      <RouteTable
        routes={routes}
        onSelectRoute={(route) => setSelectedRouteId(route.id)}
        loading={loading}
        error={error}
      />
    </div>
  );
}
