import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trophy, CheckCircle, ArrowLeft } from "lucide-react";
import {
  getSession,
  getPlayers,
  getScores,
  submitScore,
  updateSession,
} from "../services/api.js";
import PlayerCard from "./PlayerCard.jsx";

export default function ScoringSheet({ sessionId: propsSessionId }) {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = propsSessionId || params.sessionId;

  const [session, setSession] = useState(null);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [activeRound, setActiveRound] = useState("Round 1");
  const [roundInputs, setRoundInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roundsList = ["Round 1", "Round 2", "Round 3", "Bonus Points"];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [sessionData, playersData, scoresData] = await Promise.all([
        getSession(sessionId),
        getPlayers(sessionId),
        getScores(sessionId),
      ]);
      setSession(sessionData);
      setPlayers(playersData || []);
      setScores(scoresData || []);

      // Initialize round inputs for players
      const initialInputs = {};
      (playersData || []).forEach((p) => {
        initialInputs[p.id] = 0;
      });
      setRoundInputs(initialInputs);
    } catch (err) {
      console.error("Failed to load scoring sheet data:", err);
      setError("Failed to load session details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);

  // Compute total score per player from scores list
  const getPlayerTotalScore = (playerId) => {
    return scores
      .filter((s) => s.player_id === playerId)
      .reduce((acc, s) => acc + Number(s.points || 0), 0);
  };

  // Find player ID with the highest score
  const getLeaderPlayerId = () => {
    if (!players || players.length === 0) return null;
    let maxScore = -Infinity;
    let leaderId = null;

    players.forEach((p) => {
      const total = getPlayerTotalScore(p.id);
      if (total > maxScore && total > 0) {
        maxScore = total;
        leaderId = p.id;
      }
    });

    return leaderId;
  };

  const handlePointsInputChange = (playerId, val) => {
    setRoundInputs((prev) => ({
      ...prev,
      [playerId]: val,
    }));
  };

  const handleSubmitPointsForPlayer = async (playerId) => {
    const pts = roundInputs[playerId] || 0;
    try {
      const newScore = await submitScore(sessionId, playerId, pts, activeRound);
      setScores((prev) => [...prev, newScore]);
      // Reset input for this player
      setRoundInputs((prev) => ({ ...prev, [playerId]: 0 }));
    } catch (err) {
      console.error("Failed to submit score:", err);
      setError("Failed to record score entry.");
    }
  };

  const handleCompleteGame = async () => {
    try {
      // First submit any pending round inputs if non-zero
      for (const p of players) {
        const pts = roundInputs[p.id];
        if (pts && pts !== 0) {
          await submitScore(sessionId, p.id, pts, activeRound);
        }
      }

      // Mark session as completed
      await updateSession(sessionId, { status: "completed" });
      navigate(`/leaderboard/${sessionId}`);
    } catch (err) {
      console.error("Failed to complete game session:", err);
      setError("Failed to complete game session.");
    }
  };

  const leaderId = getLeaderPlayerId();

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading scoring sheet...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6 max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Score Sheet: {session?.game_name || "Board Game"}
            </h1>
            <p className="text-xs text-slate-400">
              Record scores per round or category
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-semibold flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-indigo-400" /> {activeRound} Active
        </span>
      </header>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Round Tabs */}
      <div className="flex gap-2 border-b border-slate-700 mb-6 pb-2 overflow-x-auto">
        {roundsList.map((round) => (
          <button
            key={round}
            onClick={() => setActiveRound(round)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
              activeRound === round
                ? "text-indigo-400 border-b-2 border-indigo-500 font-semibold bg-slate-800/50"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {round}
          </button>
        ))}
      </div>

      {/* Players Scoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            totalScore={getPlayerTotalScore(player.id)}
            currentRoundPoints={roundInputs[player.id] || 0}
            onPointsChange={(val) => handlePointsInputChange(player.id, val)}
            onSubmitRoundScore={() => handleSubmitPointsForPlayer(player.id)}
            isLeader={player.id === leaderId}
          />
        ))}
      </div>

      {/* Complete Game Button */}
      <button
        onClick={handleCompleteGame}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
      >
        <CheckCircle className="w-5 h-5" />
        Complete Game & View Leaderboard
      </button>
    </div>
  );
}
