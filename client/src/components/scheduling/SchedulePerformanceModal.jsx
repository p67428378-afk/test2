import React, { useState } from "react";
import { X, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { schedulePerformance } from "../../services/api";

export default function SchedulePerformanceModal({
  artists = [],
  stages = [],
  isOpen,
  onClose,
  onSuccess,
}) {
  const [artistId, setArtistId] = useState("");
  const [stageId, setStageId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!artistId || !stageId || !startTime || !endTime) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await schedulePerformance({
        artist_id: artistId,
        stage_id: stageId,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Failed to schedule performance.";
      setError(typeof msg === "object" ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Calendar className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">
              Schedule Performance Slot
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-300 font-medium text-xs mb-1">
              Select Artist *
            </label>
            <select
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
              required
            >
              <option value="">-- Choose Artist --</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.genre})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium text-xs mb-1">
              Select Stage *
            </label>
            <select
              value={stageId}
              onChange={(e) => setStageId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
              required
            >
              <option value="">-- Choose Stage --</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.location_zone}) - Cap: {s.capacity}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
            <span>
              Automated conflict detection will prevent stage collisions and
              artist double-booking.
            </span>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
            >
              {loading ? "Validating Slot..." : "Schedule Performance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
