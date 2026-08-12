import React, { useState, useEffect } from "react";
import DriverItineraryMap from "../components/DriverItineraryMap";
import { routesAPI } from "../services/api";
import { Truck, RefreshCw, MapPin, CheckCircle2 } from "lucide-react";

export default function DriverPortal() {
  const [driverId, setDriverId] = useState("DRV-101");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const data = await routesAPI.getDriverRoutes(driverId);
      setRoutes(data || []);
    } catch (err) {
      setRoutes([
        {
          id: "stop-1-uuid",
          driver_id: driverId,
          zone: "Zone 1",
          sequence_order: 1,
          order_id: "ord-1001-uuid",
          stop_type: "PICKUP",
          stop_status: "EN_ROUTE",
        },
        {
          id: "stop-2-uuid",
          driver_id: driverId,
          zone: "Zone 1",
          sequence_order: 2,
          order_id: "ord-1002-uuid",
          stop_type: "DELIVERY",
          stop_status: "PENDING",
        },
        {
          id: "stop-3-uuid",
          driver_id: driverId,
          zone: "Zone 1",
          sequence_order: 3,
          order_id: "ord-1003-uuid",
          stop_type: "PICKUP",
          stop_status: "PENDING",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [driverId]);

  const handleRouteUpdated = (updatedRoute) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === updatedRoute.id ? updatedRoute : r)),
    );
  };

  const completedStops = routes.filter(
    (r) => r.stop_status === "DELIVERED" || r.stop_status === "PICKED_UP",
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Driver Route Optimization Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Geographically optimized pickup and delivery itineraries with stop
            status updates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="DRV-101">Driver DRV-101 (Zone 1)</option>
            <option value="DRV-102">Driver DRV-102 (Zone 2)</option>
            <option value="DRV-103">Driver DRV-103 (Zone 3)</option>
          </select>

          <button
            onClick={fetchRoutes}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh Route</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {routes.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Total Stops Assigned
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {completedStops}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Stops Completed
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {routes.length - completedStops}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Stops Remaining
            </div>
          </div>
        </div>
      </div>

      <DriverItineraryMap
        routes={routes}
        driverId={driverId}
        onRouteUpdated={handleRouteUpdated}
      />
    </div>
  );
}
