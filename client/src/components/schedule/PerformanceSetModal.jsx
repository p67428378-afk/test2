import React, { useState } from "react";
import { X, Clock, AlertTriangle, PlusCircle, RotateCcw } from "lucide-react";
import { createPerformance, updatePerformanceDelay } from "../../services/api";

export const PerformanceSetModal = ({
  stages,
  artists,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState("add"); // 'add' or 'delay'

  // Add Set State
  const [selectedStage, setSelectedStage] = useState(stages[0]?.id || "");
  const [selectedArtist, setSelectedArtist] = useState(artists[0]?.id || "");
  const [startTime, setStartTime] = useState("2026-08-15T18:00");
  const [endTime, setEndTime] = useState("2026-08-15T19:30");
  const [bufferMinutes, setBufferMinutes] = useState(30);

  // Delay Update State
  const [delayStage, setDelayStage] = useState(stages[0]?.id || "");
  const [performanceId, setPerformanceId] = useState("");
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [delayReason, setDelayReason] = useState("Technical setup delay");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleAddPerformance = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const payload = {
        artist_id: selectedArtist,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        buffer_minutes: Number(bufferMinutes),
      };

      await createPerformance(selectedStage, payload);
      setSuccessMsg("Performance set scheduled successfully!");
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to create performance:", err);
      const detail =
        err.response?.data?.detail ||
        "Schedule conflict or validation error occurred.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDelay = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (!performanceId) {
        throw new Error("Please enter or select a Performance ID");
      }

      await updatePerformanceDelay(
        delayStage,
        performanceId,
        delayMinutes,
        delayReason,
      );
      setSuccessMsg(
        `Applied ${delayMinutes} min delay. Subsequent sets pushed automatically.`,
      );
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to apply delay:", err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to update performance delay.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/80 bg-slate-800/90">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Stage Timetable Allocation</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/80 bg-slate-900/50 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === "add"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule New Set</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("delay")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === "delay"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Update Set Delay</span>
          </button>
        </div>

        {/* Messages */}
        <div className="px-5 pt-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs">
              {successMsg}
            </div>
          )}
        </div>

        {/* Form Body */}
        {activeTab === "add" ? (
          <form onSubmit={handleAddPerformance} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Stage
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {stages.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.location_zone || "Zone"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Artist
              </label>
              <select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {artists.map((ar) => (
                  <option key={ar.id} value={ar.id}>
                    {ar.name} ({ar.genre || "Music"})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Changeover Buffer (Minutes)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Default: 30 minutes. Mandatory changeover buffer required
                between consecutive stage sets.
              </p>
            </div>

            <div className="pt-3 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Book Performance"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleApplyDelay} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stage
              </label>
              <select
                value={delayStage}
                onChange={(e) => setDelayStage(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {stages.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Performance ID
              </label>
              <input
                type="text"
                value={performanceId}
                onChange={(e) => setPerformanceId(e.target.value)}
                placeholder="UUID or set ID"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Delay Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason / Note
              </label>
              <input
                type="text"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-3 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {loading ? "Applying..." : "Propagate Set Delay"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
