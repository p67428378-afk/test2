import React, { useState, useEffect } from "react";
import {
  getStages,
  getArtists,
  getStagePerformances,
  getStageNotifications,
} from "../../services/api";
import {
  Calendar,
  Clock,
  Plus,
  AlertCircle,
  Bell,
  RefreshCw,
  Music,
} from "lucide-react";
import { PerformanceSetModal } from "./PerformanceSetModal";

export const StageScheduleTimeline = () => {
  const [stages, setStages] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [performances, setPerformances] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const loadBaseData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [stData, arData] = await Promise.all([getStages(), getArtists()]);
      setStages(stData || []);
      setArtists(arData || []);
      if (stData && stData.length > 0 && !selectedStageId) {
        setSelectedStageId(stData[0].id);
      }
    } catch (err) {
      console.error("Failed to load base schedule data:", err);
      setError("Failed to fetch stages and artists list.");
    } finally {
      setLoading(false);
    }
  };

  const loadStagePerformances = async (stageId) => {
    if (!stageId) return;
    try {
      const [perfData, notifData] = await Promise.all([
        getStagePerformances(stageId),
        getStageNotifications(stageId).catch(() => []),
      ]);
      setPerformances(perfData || []);
      setNotifications(notifData || []);
    } catch (err) {
      console.error("Failed to load stage performances:", err);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (selectedStageId) {
      loadStagePerformances(selectedStageId);
    }
  }, [selectedStageId]);

  const activeStage = stages.find((s) => s.id === selectedStageId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">
              Artist Scheduling & Stage Allocation
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visual stage timetables, 30-minute mandatory changeover buffers, and
            set delay propagation alerts.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadStagePerformances(selectedStageId)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-medium transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Schedule</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Set</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stage Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-700/60">
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStageId(st.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedStageId === st.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {st.name} ({st.location_zone || "Zone"})
          </button>
        ))}
      </div>

      {/* Notifications / Delay Alerts for active stage */}
      {notifications.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Stage Crew Delay Notifications</span>
          </div>
          {notifications.map((notif, idx) => (
            <div key={idx} className="text-xs text-amber-200">
              • {notif.message || notif.text || JSON.stringify(notif)}
            </div>
          ))}
        </div>
      )}

      {/* Stage Timetable Timeline */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              {activeStage?.name || "Selected Stage"}
            </h2>
            <p className="text-xs text-slate-400">
              Capacity:{" "}
              {activeStage?.max_capacity
                ? activeStage.max_capacity.toLocaleString()
                : "N/A"}{" "}
              attendees | 30-Min Mandatory Changeover Buffer Required
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20">
            {performances.length} Sets Scheduled
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading schedule...
          </div>
        ) : performances.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Music className="w-8 h-8 text-slate-500 mx-auto" />
            <p>No performances scheduled for this stage yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs text-indigo-400 font-semibold hover:underline"
            >
              Click here to schedule the first artist set.
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {performances.map((perf, index) => {
              const artistObj = artists.find((a) => a.id === perf.artist_id);
              const startTimeStr = new Date(perf.start_time).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" },
              );
              const endTimeStr = new Date(perf.end_time).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" },
              );
              const isDelayed =
                perf.status === "DELAYED" || perf.delay_minutes > 0;

              return (
                <div key={perf.id} className="relative">
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isDelayed
                        ? "bg-amber-950/20 border-amber-500/50"
                        : "bg-slate-800/90 border-slate-700/80 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-lg">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-white text-base">
                              {artistObj?.name ||
                                perf.artist_name ||
                                `Artist (${perf.artist_id?.substring(0, 8)})`}
                            </h3>
                            {artistObj?.genre && (
                              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-slate-700 text-slate-300 rounded-md">
                                {artistObj.genre}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Performance Slot:{" "}
                            <span className="text-indigo-300 font-medium">
                              {startTimeStr} – {endTimeStr}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-xs">
                        <span className="px-3 py-1 bg-slate-700/60 text-slate-300 rounded-lg flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Buffer: {perf.buffer_minutes || 30} mins</span>
                        </span>
                        {isDelayed && (
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-semibold">
                            Delayed (+{perf.delay_minutes || 15}m)
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-mono">
                          ID: {perf.id?.substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Changeover Buffer visual separator */}
                  {index < performances.length - 1 && (
                    <div className="my-2 ml-6 pl-6 border-l-2 border-dashed border-indigo-500/30 py-2 flex items-center text-xs text-indigo-400 font-medium space-x-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {perf.buffer_minutes || 30}-minute mandatory changeover
                        buffer enforced before next performance
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <PerformanceSetModal
          stages={stages}
          artists={artists}
          onClose={() => setShowModal(false)}
          onRefresh={() => loadStagePerformances(selectedStageId)}
        />
      )}
    </div>
  );
};
