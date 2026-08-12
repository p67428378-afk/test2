import React, { useState } from "react";
import { Truck, MapPin, AlertCircle } from "lucide-react";
import { routesAPI } from "../services/api";

export default function DriverItineraryMap({
  routes = [],
  driverId = "DRV-101",
  onRouteUpdated,
}) {
  const [activeZone, setActiveZone] = useState("Zone 1");
  const [loadingStopId, setLoadingStopId] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdateStatus = async (stopId, newStatus) => {
    setLoadingStopId(stopId);
    setError(null);

    try {
      const updated = await routesAPI.updateStopStatus(stopId, {
        stop_status: newStatus,
      });
      if (onRouteUpdated) {
        onRouteUpdated(updated);
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to update stop status.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoadingStopId(null);
    }
  };

  const filteredRoutes = routes.filter(
    (r) => !activeZone || r.zone === activeZone || routes.length < 5,
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Optimized Driver Route Itinerary
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Driver ID: <span className="font-semibold">{driverId}</span>
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex space-x-2">
          {["Zone 1", "Zone 2", "Zone 3"].map((z) => (
            <button
              key={z}
              onClick={() => setActiveZone(z)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeZone === z
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-4 text-white relative min-h-[250px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10">
            <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              GPS Navigation Active
            </span>
            <h4 className="text-sm font-bold mt-2">
              Route Optimization Engine
            </h4>
            <p className="text-xs text-slate-400">Target Zone: {activeZone}</p>
          </div>

          <div className="relative z-10 bg-slate-800/80 backdrop-blur p-3 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Next Stop Distance:</span>
              <span className="font-bold text-emerald-400">1.2 miles</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Est. Travel Time:</span>
              <span className="font-bold text-blue-400">4 mins</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">
            Sequenced Stop List ({filteredRoutes.length} Stops)
          </h3>

          {filteredRoutes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed rounded-xl text-xs">
              No stops currently assigned to this zone.
            </div>
          ) : (
            filteredRoutes.map((route, idx) => (
              <div
                key={route.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    #{route.sequence_order || idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">
                        {route.stop_type || "PICKUP"} - Order #
                        {route.order_id?.slice(0, 8)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          route.stop_status === "DELIVERED" ||
                          route.stop_status === "PICKED_UP"
                            ? "bg-emerald-100 text-emerald-800"
                            : route.stop_status === "CUSTOMER_UNAVAILABLE"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {route.stop_status || "PENDING"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        Zone {route.zone || activeZone} • Scheduled Window:
                        09:00 - 11:00 AM
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleUpdateStatus(route.id, "EN_ROUTE")}
                    disabled={loadingStopId === route.id}
                    className="px-2.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    En Route
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        route.id,
                        route.stop_type === "DELIVERY"
                          ? "DELIVERED"
                          : "PICKED_UP",
                      )
                    }
                    disabled={loadingStopId === route.id}
                    className="px-2.5 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(route.id, "CUSTOMER_UNAVAILABLE")
                    }
                    disabled={loadingStopId === route.id}
                    className="px-2.5 py-1.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    Unavailable
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
