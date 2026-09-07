import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Play,
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
} from "lucide-react";
import { getSessions, deleteSession } from "../services/api.js";

export default function DashboardView() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSessionsList = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSessions(0, 50);
      setSessions(data || []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError(
        "Unable to fetch game sessions. Please check backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionsList();
  }, []);

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;
    try {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Failed to delete session.");
    }
  };

  const totalGames = sessions.length;
  const activeSessions = sessions.filter(
    (s) => s.status !== "completed",
  ).length;
  const completedSessions = sessions.filter(
    (s) => s.status === "completed",
  ).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-400 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-indigo-400" />
            Board Game Scorer
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track players, tally scores, and declare champions!
          </p>
        </div>
        <button
          onClick={() => navigate("/setup")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-5 h-5" /> Start New Game Session
        </button>
      </header>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl mb-6 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={fetchSessionsList}
            className="underline text-xs hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <h3 className="text-sm font-medium">Total Games Played</h3>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white">{totalGames}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <h3 className="text-sm font-medium">Active Sessions</h3>
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-indigo-400">{activeSessions}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <h3 className="text-sm font-medium">Completed Games</h3>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            {completedSessions}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-slate-200">
        Recent Game Sessions
      </h2>

      {loading ? (
        <div className="text-center py-12 text-slate-400">
          Loading game sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 text-center">
          <p className="text-slate-400 mb-4">
            No game sessions found. Create your first board game session to
            start scoring!
          </p>
          <button
            onClick={() => navigate("/setup")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Start First Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const isCompleted = session.status === "completed";
            return (
              <div
                key={session.id}
                onClick={() =>
                  navigate(
                    isCompleted
                      ? `/leaderboard/${session.id}`
                      : `/scoring/${session.id}`,
                  )
                }
                className="bg-slate-800 hover:bg-slate-750 p-5 rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition-all hover:border-slate-600 shadow"
              >
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    }`}
                  >
                    {isCompleted ? "Completed" : "In Progress"}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {session.game_name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Created: {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        isCompleted
                          ? `/leaderboard/${session.id}`
                          : `/scoring/${session.id}`,
                      );
                    }}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 text-sm ${
                      isCompleted
                        ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    {isCompleted ? "View Scorecard" : "Resume Session"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
