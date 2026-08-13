import React from "react";
import { Award, Medal, Flame, RefreshCw, BarChart2 } from "lucide-react";

export default function LiveLeaderboardTable({
  standings = [],
  loading = false,
  onRefresh,
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl text-slate-100">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">
            Live Leaderboard & Standings
          </h2>
          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded border border-indigo-500/30">
            FIDE Tie-Breaks
          </span>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center space-x-1 text-xs font-medium"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold text-center w-16">Rank</th>
              <th className="px-4 py-3 font-semibold">Player</th>
              <th className="px-4 py-3 font-semibold text-right">Rating</th>
              <th className="px-4 py-3 font-semibold text-right text-emerald-400">
                Total Points
              </th>
              <th className="px-4 py-3 font-semibold text-right text-indigo-300">
                Buchholz
              </th>
              <th className="px-4 py-3 font-semibold text-right text-amber-300">
                Sonneborn-Berger
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Calculating standings...
                </td>
              </tr>
            ) : standings.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No standings available yet. Play round matches to calculate
                  standings.
                </td>
              </tr>
            ) : (
              standings.map((row, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                // Check tie indicator
                const prevRow = idx > 0 ? standings[idx - 1] : null;
                const nextRow =
                  idx < standings.length - 1 ? standings[idx + 1] : null;
                const isTiedWithPrev =
                  prevRow &&
                  prevRow.total_points === row.total_points &&
                  prevRow.buchholz === row.buchholz &&
                  prevRow.sonneborn_berger === row.sonneborn_berger;
                const isTiedWithNext =
                  nextRow &&
                  nextRow.total_points === row.total_points &&
                  nextRow.buchholz === row.buchholz &&
                  nextRow.sonneborn_berger === row.sonneborn_berger;
                const isTied = isTiedWithPrev || isTiedWithNext;

                return (
                  <tr
                    key={row.player_id || idx}
                    className={`hover:bg-slate-700/30 transition-colors ${
                      isFirst ? "bg-amber-500/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 text-center font-bold">
                      <div className="flex items-center justify-center space-x-1">
                        {isFirst ? (
                          <Medal className="w-5 h-5 text-amber-400 shrink-0" />
                        ) : isSecond ? (
                          <Medal className="w-5 h-5 text-slate-300 shrink-0" />
                        ) : isThird ? (
                          <Medal className="w-5 h-5 text-amber-700 shrink-0" />
                        ) : (
                          <span className="text-slate-400">
                            #{row.rank || idx + 1}
                          </span>
                        )}
                        {isTied && (
                          <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded border border-indigo-500/30">
                            TIED
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-white">
                      <div className="flex items-center space-x-2">
                        <span>{row.full_name}</span>
                        {isFirst && (
                          <span className="inline-flex items-center space-x-1 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>Leader</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-semibold text-slate-400">
                      {row.rating || 1200}
                    </td>

                    <td className="px-4 py-3.5 text-right font-extrabold text-base text-emerald-400">
                      {Number(row.total_points || 0).toFixed(1)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-bold text-indigo-300">
                      {Number(row.buchholz || 0).toFixed(1)}
                    </td>

                    <td className="px-4 py-3.5 text-right font-bold text-amber-300">
                      {Number(row.sonneborn_berger || 0).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
