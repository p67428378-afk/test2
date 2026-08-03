import React, { useState, useEffect, useRef } from "react";
import InteractiveMap from "../components/map/InteractiveMap.jsx";
import StopDetailCard from "../components/map/StopDetailCard.jsx";
import RouteSelector from "../components/route/RouteSelector.jsx";
import RouteTimeline from "../components/route/RouteTimeline.jsx";
import { busService } from "../services/api.js";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function CommuterDashboard() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [etaData, setEtaData] = useState(null);

  // Loading & Error states
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [etaLoading, setEtaLoading] = useState(false);
  const [etaError, setEtaError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch all routes on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setRoutesLoading(true);
        const data = await busService.getRoutes();
        setRoutes(data);
        if (data.length > 0) {
          setSelectedRoute(data[0]);
        }
        setRoutesError(null);
      } catch (err) {
        setRoutesError("Failed to load bus routes. Please try again.");
      } finally {
        setRoutesLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  // Fetch stops and buses when selected route changes
  useEffect(() => {
    if (!selectedRoute) return;

    const fetchRouteDetails = async () => {
      try {
        setDetailsLoading(true);
        const [stopsData, busesData] = await Promise.all([
          busService.getRouteStops(selectedRoute.id),
          busService.getRouteBuses(selectedRoute.id),
        ]);
        setStops(stopsData);
        setBuses(busesData);
        setDetailsError(null);
        setLastUpdated(new Date());

        // Auto-select first stop if none selected
        if (stopsData.length > 0 && !selectedStop) {
          setSelectedStop(stopsData[0]);
        }
      } catch (err) {
        setDetailsError("Failed to load route details.");
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchRouteDetails();

    // Set up polling interval for real-time updates (every 5 seconds)
    const interval = setInterval(async () => {
      try {
        const busesData = await busService.getRouteBuses(selectedRoute.id);
        setBuses(busesData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Failed to poll live bus locations:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedRoute]);

  // Fetch ETA when selected stop changes
  useEffect(() => {
    if (!selectedStop) return;

    const fetchEta = async () => {
      try {
        setEtaLoading(true);
        const data = await busService.getStopEta(selectedStop.id);
        setEtaData(data);
        setEtaError(null);
      } catch (err) {
        setEtaError("Failed to calculate ETAs.");
      } finally {
        setEtaLoading(false);
      }
    };

    fetchEta();

    // Poll ETA every 10 seconds
    const interval = setInterval(fetchEta, 10000);
    return () => clearInterval(interval);
  }, [selectedStop]);

  const handleRefresh = async () => {
    if (!selectedRoute) return;
    try {
      setDetailsLoading(true);
      const [stopsData, busesData] = await Promise.all([
        busService.getRouteStops(selectedRoute.id),
        busService.getRouteBuses(selectedRoute.id),
      ]);
      setStops(stopsData);
      setBuses(busesData);
      if (selectedStop) {
        const etaData = await busService.getStopEta(selectedStop.id);
        setEtaData(etaData);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setDetailsError("Failed to refresh live data.");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-slate-100">
            Real-Time Commuter Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Live tracking and dynamic ETA calculations updated automatically.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {lastUpdated && (
            <span className="text-[10px] text-slate-500 font-mono">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={detailsLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-slate-100 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-600/10"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${detailsLoading ? "animate-spin" : ""}`}
            />
            Refresh Live Data
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Selector & Timeline */}
        <div className="lg:col-span-4 space-y-6">
          <RouteSelector
            routes={routes}
            selectedRoute={selectedRoute}
            onSelectRoute={(route) => {
              setSelectedRoute(route);
              setSelectedStop(null);
              setSelectedBus(null);
              setEtaData(null);
            }}
            loading={routesLoading}
            error={routesError}
          />

          <RouteTimeline
            stops={stops}
            selectedStop={selectedStop}
            onSelectStop={setSelectedStop}
            loading={detailsLoading}
            error={detailsError}
          />
        </div>

        {/* Right Column: Map & Stop Detail Card */}
        <div className="lg:col-span-8 space-y-6">
          <InteractiveMap
            stops={stops}
            buses={buses}
            selectedStop={selectedStop}
            onSelectStop={setSelectedStop}
            selectedBus={selectedBus}
            onSelectBus={setSelectedBus}
          />

          <StopDetailCard
            stop={selectedStop}
            etaData={etaData}
            loading={etaLoading}
            error={etaError}
          />
        </div>
      </div>
    </div>
  );
}
