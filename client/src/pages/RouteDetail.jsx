import React, { useState, useEffect } from "react";
import { busService } from "../services/api.js";
import { MapPin, Bus, Clock, ArrowLeft, AlertCircle } from "lucide-react";

export default function RouteDetail({ routeId, onBack }) {
  const [route, setRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const routesData = await busService.getRoutes();
        const currentRoute = routesData.find((r) => r.id === routeId);
        setRoute(currentRoute);

        if (currentRoute) {
          const [stopsData, busesData] = await Promise.all([
            busService.getRouteStops(currentRoute.id),
            busService.getRouteBuses(currentRoute.id),
          ]);
          setStops(stopsData);
          setBuses(busesData);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load route details.");
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchDetails();
    }
  }, [routeId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-2">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">Loading route details...</span>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-md mx-auto mt-12">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-slate-200 font-bold text-lg">
          Error Loading Route
        </h3>
        <p className="text-slate-400 text-sm mt-2">
          {error || "Route not found."}
        </p>
        <button
          onClick={onBack}
          className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500 text-slate-100 font-black text-sm rounded-lg font-mono">
              {route.route_number}
            </span>
            <h1 className="text-xl font-black text-slate-100">
              {route.route_name}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detailed route schedule and active fleet status.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">
              Total Stops
            </p>
            <p className="text-lg font-black text-slate-200 mt-0.5">
              {stops.length}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Bus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">
              Active Fleet
            </p>
            <p className="text-lg font-black text-slate-200 mt-0.5">
              {buses.length} Buses
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">
              Frequency
            </p>
            <p className="text-lg font-black text-slate-200 mt-0.5">
              Every 15 mins
            </p>
          </div>
        </div>
      </div>

      {/* Stops & Fleet Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stops List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-slate-100 font-bold text-base mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-400" />
            Stops Sequence
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {stops.map((stop, index) => (
              <div
                key={stop.id}
                className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold font-mono">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-200">
                    {stop.stop_name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {stop.location.latitude.toFixed(4)},{" "}
                  {stop.location.longitude.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Fleet List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-slate-100 font-bold text-base mb-4 flex items-center gap-2">
            <Bus className="h-5 w-5 text-amber-400" />
            Active Fleet Status
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {buses.length > 0 ? (
              buses.map((bus) => (
                <div
                  key={bus.id}
                  className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">
                        {bus.vehicle_id}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Last Ping:{" "}
                        {bus.timestamp
                          ? new Date(bus.timestamp).toLocaleTimeString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Online
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                No active buses currently on this route.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
