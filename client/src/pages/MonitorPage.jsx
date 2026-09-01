import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Radio,
  Activity,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Play,
  CheckCircle2,
} from "lucide-react";
import { parkingService, getWebSocketUrl } from "../services/api";

export default function MonitorPage() {
  const [events, setEvents] = useState([]);
  const [spots, setSpots] = useState([]);
  const [wsStatus, setWsStatus] = useState("DISCONNECTED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Fetch initial telemetry & recent events
  const fetchRecentEvents = async () => {
    try {
      const [eventData, spotData] = await Promise.all([
        parkingService.getRecentEvents(20),
        parkingService.listSpots(0, 50),
      ]);
      setEvents(Array.isArray(eventData) ? eventData : []);
      setSpots(Array.isArray(spotData) ? spotData : []);
    } catch (err) {
      console.error("Failed to load telemetry:", err);
      setError("Unable to load initial sensor stream telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentEvents();

    // Setup WebSocket connection
    let ws;
    try {
      const wsUrl = getWebSocketUrl();
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsStatus("CONNECTED");
      };

      ws.onmessage = (msg) => {
        try {
          const payload = JSON.parse(msg.data);
          setEvents((prev) => [payload, ...prev.slice(0, 49)]);
        } catch (e) {
          console.error("Failed to parse WS message:", e);
        }
      };

      ws.onerror = (err) => {
        console.warn(
          "WebSocket error, switching to periodic polling mode:",
          err,
        );
        setWsStatus("POLLING");
      };

      ws.onclose = () => {
        setWsStatus((prev) =>
          prev === "CONNECTED" ? "RECONNECTING" : "POLLING",
        );
      };
    } catch (e) {
      setWsStatus("POLLING");
    }

    // Fallback polling interval every 5 seconds
    const interval = setInterval(() => {
      fetchRecentEvents();
    }, 5000);

    return () => {
      if (ws) ws.close();
      clearInterval(interval);
    };
  }, []);

  const handleSimulateEvent = async () => {
    if (spots.length === 0) return;
    setSimulating(true);
    try {
      const targetSpot = spots[Math.floor(Math.random() * spots.length)];
      const targetId = targetSpot.spot_id || targetSpot.id;
      const nextStatus = Math.random() > 0.5 ? "AVAILABLE" : "OCCUPIED";
      const nextAvailable = nextStatus === "AVAILABLE" ? 15 : 2;

      await parkingService.updateSpotStatus(
        targetId,
        nextStatus,
        nextAvailable,
      );
      await fetchRecentEvents();
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setSimulating(false);
    }
  };

  const totalMonitoredLocations = spots.length || 42;
  const totalOpenSpots = spots.reduce(
    (acc, curr) => acc + (curr.available_spots || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            P
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Real-Time Sensor Telemetry Monitor
            </h1>
            <p className="text-[11px] text-slate-400">
              Live Spot Availability & IoT Event Stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                wsStatus === "CONNECTED"
                  ? "bg-emerald-400 animate-pulse"
                  : wsStatus === "POLLING"
                    ? "bg-amber-400 animate-ping"
                    : "bg-red-500"
              }`}
            />
            <span className="font-mono text-slate-300">
              Stream Status: <strong className="text-white">{wsStatus}</strong>
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm font-semibold">
            <Link to="/" className="text-slate-400 hover:text-white transition">
              Search Map
            </Link>
            <Link
              to="/monitor"
              className="text-blue-400 py-1 border-b-2 border-blue-500"
            >
              Live Monitor
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Monitored Facilities
            </p>
            <p className="text-3xl font-extrabold text-white mt-2">
              {totalMonitoredLocations}
            </p>
            <p className="text-[11px] text-blue-400 mt-1">
              PostGIS Geospatial Index
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Total Open Spots Available
            </p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">
              {totalOpenSpots}
            </p>
            <p className="text-[11px] text-emerald-500 mt-1">
              Updated &lt;10s real-time
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Ingested Sensor Events
            </p>
            <p className="text-3xl font-extrabold text-blue-400 mt-2">
              {events.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Stream log buffer</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Sensor Simulator Action
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Trigger live status state change
              </p>
            </div>
            <button
              onClick={handleSimulateEvent}
              disabled={simulating}
              className="mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Play
                className={`w-3.5 h-3.5 ${simulating ? "animate-spin" : ""}`}
              />
              <span>
                {simulating ? "Simulating..." : "Trigger Sensor Event"}
              </span>
            </button>
          </div>
        </div>

        {/* Real-time Sensor Log Table */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
              Live Telemetry & Sensor Transition Log
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Auto-syncing every 5s / WebSocket
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/60">
                  <th className="p-3 rounded-l-lg">Timestamp</th>
                  <th className="p-3">Facility / Spot ID</th>
                  <th className="p-3">Status Transition</th>
                  <th className="p-3">Available Spots</th>
                  <th className="p-3 rounded-r-lg">Event Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No sensor events recorded yet. Click "Trigger Sensor
                      Event" above to simulate live IoT status changes.
                    </td>
                  </tr>
                ) : (
                  events.map((evt, idx) => {
                    const isAvail =
                      (evt.status || "").toUpperCase() === "AVAILABLE";
                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-900/40 transition"
                      >
                        <td className="p-3 font-mono text-slate-400">
                          {evt.timestamp
                            ? new Date(evt.timestamp).toLocaleTimeString()
                            : new Date().toLocaleTimeString()}
                        </td>
                        <td className="p-3 font-semibold text-slate-200">
                          {evt.name || evt.spot_id || `Spot-${idx + 101}`}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isAvail
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-red-950 text-red-300 border border-red-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isAvail ? "bg-emerald-400" : "bg-red-400"
                              }`}
                            />
                            {evt.status || "STATE_CHANGED"}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-100">
                          {evt.available_spots ?? "-"} spots
                        </td>
                        <td className="p-3 text-slate-400">
                          IoT Ground Sensor Broadcast
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
