import React from "react";
import { Plus, Minus, Trophy } from "lucide-react";

export default function PlayerCard({
  player,
  totalScore = 0,
  currentRoundPoints = 0,
  onPointsChange,
  onSubmitRoundScore,
  isLeader = false,
}) {
  const avatarColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-indigo-500",
    "bg-purple-500",
  ];

  // Pick deterministic color based on player name length / id
  const charCodeSum = (player?.name || "P")
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const colorClass = avatarColors[charCodeSum % avatarColors.length];

  return (
    <div
      className={`bg-slate-800 p-5 rounded-xl border flex justify-between items-center transition-all ${
        isLeader
          ? "border-emerald-500/60 shadow-lg shadow-emerald-500/10"
          : "border-slate-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center font-bold text-white text-base shadow`}
        >
          {(player?.name || "P")[0].toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-white">{player?.name}</h3>
            {isLeader && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                <Trophy className="w-3 h-3 text-emerald-400" /> Leader
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">Total Score:</span>
          <span
            className={`ml-2 text-xl font-extrabold ${isLeader ? "text-emerald-400" : "text-indigo-400"}`}
          >
            {totalScore} pts
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            onPointsChange && onPointsChange(currentRoundPoints - 1)
          }
          className="w-9 h-9 bg-slate-700 hover:bg-slate-600 rounded-lg text-xl font-bold text-white flex items-center justify-center transition-colors"
          aria-label={`Decrease points for ${player?.name}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={currentRoundPoints}
          onChange={(e) =>
            onPointsChange && onPointsChange(Number(e.target.value) || 0)
          }
          className="w-16 text-center bg-slate-900 border border-slate-700 rounded-lg py-1.5 font-bold text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() =>
            onPointsChange && onPointsChange(currentRoundPoints + 1)
          }
          className="w-9 h-9 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xl font-bold text-white flex items-center justify-center transition-colors"
          aria-label={`Increase points for ${player?.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
        {onSubmitRoundScore && (
          <button
            type="button"
            onClick={onSubmitRoundScore}
            className="ml-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
