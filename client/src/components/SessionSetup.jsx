import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Trash2, ArrowLeft, Play } from "lucide-react";
import { createSession, addPlayer, deletePlayer } from "../services/api.js";

export default function SessionSetup() {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState("Catan Championship");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [players, setPlayers] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddPlayer = async (e) => {
    e?.preventDefault();
    if (!newPlayerName.trim()) {
      setError("Please enter a valid player name.");
      return;
    }
    setError("");

    try {
      setLoading(true);
      let activeSessionId = sessionId;

      // If session not created yet, create session first
      if (!activeSessionId) {
        const title = gameName.trim() || "Board Game Session";
        const sessionRes = await createSession(title);
        activeSessionId = sessionRes.id;
        setSessionId(activeSessionId);
      }

      const playerRes = await addPlayer(activeSessionId, newPlayerName.trim());
      setPlayers((prev) => [...prev, playerRes]);
      setNewPlayerName("");
    } catch (err) {
      console.error("Failed to add player:", err);
      setError(
        err.response?.data?.detail || "Failed to add player to session.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      if (sessionId) {
        await deletePlayer(sessionId, playerId);
      }
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    } catch (err) {
      console.error("Failed to delete player:", err);
      setError("Failed to remove player.");
    }
  };

  const handleStartSession = async () => {
    if (players.length === 0) {
      setError("Please add at least one player to start scoring.");
      return;
    }
    if (!sessionId) {
      setError("Session not initialized properly.");
      return;
    }
    navigate(`/scoring/${sessionId}`);
  };

  const avatarColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6 max-w-3xl mx-auto">
      <header className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Game Setup</h1>
          <p className="text-slate-400 text-sm">
            Configure game title and register participating players
          </p>
        </div>
      </header>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Game Title Input */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 shadow-md">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Game Title
        </label>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="e.g. Catan Championship, Ticket to Ride"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Add New Player Form */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-4">
          Add New Player
        </h2>
        <form onSubmit={handleAddPlayer} className="flex gap-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name (e.g. Charlie)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" /> Add Player
          </button>
        </form>
      </div>

      {/* Registered Players List */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-4">
          Registered Players ({players.length})
        </h2>

        {players.length === 0 ? (
          <p className="text-slate-400 text-sm italic">
            No players registered yet. Add player names above.
          </p>
        ) : (
          <div className="space-y-3">
            {players.map((p, index) => {
              const bgClass = avatarColors[index % avatarColors.length];
              return (
                <div
                  key={p.id || index}
                  className="flex justify-between items-center bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center font-bold text-white text-sm`}
                    >
                      {p.name[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-white">{p.name}</span>
                    {index === 0 && (
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                        Host
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePlayer(p.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Remove player"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Start Session Button */}
      <button
        onClick={handleStartSession}
        disabled={players.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-5 h-5" />
        Start Scoring Session ({players.length}{" "}
        {players.length === 1 ? "Player" : "Players"})
      </button>
    </div>
  );
}
