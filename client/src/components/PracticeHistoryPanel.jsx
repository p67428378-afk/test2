import React, { useState, useEffect } from "react";
import { practiceService } from "../services/api";

export default function PracticeHistoryPanel() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await practiceService.getPracticeSessions("default_user");
      setSessions(data || []);
    } catch (err) {
      setError("Failed to load practice history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Recently";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading practice logs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-2">
        <span className="text-4xl" role="img" aria-label="chart">
          📊
        </span>
        <h3 className="text-lg font-bold text-slate-700">
          No Practice Logs Yet
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Start a guided practice session from any routine to track your
          duration, poses completed, and consistency over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-teal-950 font-serif">
          📊 Practice Session History ({sessions.length})
        </h3>
        <button
          onClick={fetchSessions}
          className="text-xs text-teal-700 hover:text-teal-900 font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  🧘 Session Completed
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(sess.completed_at)}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {sess.routine_name || "Custom Yoga Practice"}
              </h4>
              {sess.notes && (
                <p className="text-xs text-slate-600 italic">{sess.notes}</p>
              )}
            </div>

            <div className="flex gap-4 items-center text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-sans">
                  Duration
                </span>
                <span className="font-bold text-teal-900">
                  {formatDuration(sess.completed_duration_seconds)}
                </span>
              </div>
              <div className="border-l pl-3">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">
                  Poses
                </span>
                <span className="font-bold text-teal-900">
                  {sess.poses_completed} Completed
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
