import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, Download, Award } from "lucide-react";
import { getLeaderboard } from "../services/api.js";
import WinnerPodium from "./WinnerPodium.jsx";

export default function LeaderboardView({ sessionId: propsSessionId }) {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = propsSessionId || params.sessionId;

  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLeaderboard(sessionId);
      setLeaderboardData(data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("Unable to fetch leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchLeaderboardData();
    }
  }, [sessionId]);

  const handleExportCSV = () => {
    if (!leaderboardData || !leaderboardData.ranked_players) return;
    const headers = ["Rank", "Player Name", "Total Score", "Is Winner"];
    const rows = leaderboardData.ranked_players.map((p) => [
      p.rank,
      `"${p.name}"`,
      p.total_score,
      p.is_winner ? "Yes" : "No",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${leaderboardData.game_name || "Leaderboard"}_results.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading leaderboard standings...
      </div>
    );
  }

  const {
    ranked_players = [],
    winners = [],
    game_name,
  } = leaderboardData || {};

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6 max-w-4xl mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className="text-xs text-slate-400 font-mono">
          Game:{" "}
          <strong className="text-slate-200">
            {game_name || "Board Game Session"}
          </strong>
        </span>
      </header>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Podium & Winner Banner */}
      <WinnerPodium rankedPlayers={ranked_players} winners={winners} />

      {/* Standings Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8 shadow-md">
        <div className="p-4 border-b border-slate-700 font-bold text-white flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Full Standings
          </span>
          <span className="text-xs font-normal text-slate-400">
            {ranked_players.length} Total Players
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Player</th>
                <th className="p-3.5 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {ranked_players.map((player) => {
                const isWinner = player.is_winner;
                return (
                  <tr
                    key={player.player_id || player.name}
                    className={
                      isWinner ? "bg-amber-500/10" : "hover:bg-slate-750"
                    }
                  >
                    <td
                      className={`p-3.5 font-bold ${isWinner ? "text-amber-400" : "text-slate-400"}`}
                    >
                      #{player.rank}
                    </td>
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      {player.name}
                      {isWinner && (
                        <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 rounded font-semibold border border-emerald-500/30">
                          WINNER
                        </span>
                      )}
                    </td>
                    <td
                      className={`p-3.5 font-extrabold text-right ${isWinner ? "text-amber-400" : "text-slate-200"}`}
                    >
                      {player.total_score} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/setup")}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-5 h-5" /> Start New Session
        </button>
        <button
          onClick={handleExportCSV}
          className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-5 h-5" /> Export Results
        </button>
      </div>
    </div>
  );
}
