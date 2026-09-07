import React from "react";
import { Crown, Trophy, Award, Medal } from "lucide-react";

export default function WinnerPodium({ rankedPlayers = [], winners = [] }) {
  if (!rankedPlayers || rankedPlayers.length === 0) return null;

  const winnerNames = new Set(winners.map((w) => w.name || w.player_id));

  const firstPlace =
    rankedPlayers.find((p) => p.rank === 1) || rankedPlayers[0];
  const secondPlace =
    rankedPlayers.find((p) => p.rank === 2) || rankedPlayers[1];
  const thirdPlace =
    rankedPlayers.find((p) => p.rank === 3) || rankedPlayers[2];

  return (
    <div className="space-y-6">
      {/* Winner Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-emerald-500/20 p-8 rounded-2xl border border-amber-500/40 text-center relative overflow-hidden shadow-xl">
        <div className="flex justify-center mb-3">
          <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
          WINNER: {winners.map((w) => w.name).join(", ") || firstPlace?.name} (
          {firstPlace?.total_score || 0} Points)! 🎉
        </h1>
        <p className="text-slate-300 mt-2 font-medium">
          Congratulations to the champion(s) of this session!
        </p>
      </div>

      {/* Podium Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end my-8">
        {/* 2nd Place */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center shadow-lg transform transition-transform hover:-translate-y-1">
          <div className="flex justify-center mb-1">
            <Medal className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg truncate">
            {secondPlace ? secondPlace.name : "—"}
          </h3>
          <p className="text-lg font-bold text-slate-300">
            {secondPlace ? `${secondPlace.total_score} pts` : "0 pts"}
          </p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-300 mt-1">
            2nd Place
          </span>
        </div>

        {/* 1st Place */}
        <div className="bg-slate-800 p-5 rounded-xl border-2 border-amber-500 text-center bg-amber-500/10 scale-105 shadow-xl shadow-amber-500/10 transform transition-transform hover:-translate-y-1">
          <div className="flex justify-center mb-1">
            <Crown className="w-10 h-10 text-amber-400" />
          </div>
          <h3 className="font-extrabold text-amber-300 text-lg sm:text-xl truncate">
            {firstPlace ? firstPlace.name : "—"}
          </h3>
          <p className="text-2xl font-black text-amber-400">
            {firstPlace ? `${firstPlace.total_score} pts` : "0 pts"}
          </p>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 mt-1">
            👑 1st Place
          </span>
        </div>

        {/* 3rd Place */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center shadow-lg transform transition-transform hover:-translate-y-1">
          <div className="flex justify-center mb-1">
            <Award className="w-8 h-8 text-amber-700" />
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg truncate">
            {thirdPlace ? thirdPlace.name : "—"}
          </h3>
          <p className="text-lg font-bold text-slate-300">
            {thirdPlace ? `${thirdPlace.total_score} pts` : "0 pts"}
          </p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-300 mt-1">
            3rd Place
          </span>
        </div>
      </div>
    </div>
  );
}
