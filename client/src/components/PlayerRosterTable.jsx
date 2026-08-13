import React from "react";
import { Users, Shield, Mail, Award, Search } from "lucide-react";

export default function PlayerRosterTable({
  players = [],
  loading = false,
  searchTerm = "",
  onSearchChange,
}) {
  const filteredPlayers = players.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.fide_id?.toLowerCase().includes(term) ||
      String(p.rating).includes(term)
    );
  });

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Tournament Roster</h2>
          <span className="px-2.5 py-0.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded-full">
            {players.length} Players
          </span>
        </div>

        {onSearchChange && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search roster..."
              className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/60 text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold w-16 text-center">Seed</th>
              <th className="px-4 py-3 font-semibold">Player Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold text-center">FIDE ID</th>
              <th className="px-4 py-3 font-semibold text-right">Rating</th>
              <th className="px-4 py-3 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Loading roster...
                </td>
              </tr>
            ) : filteredPlayers.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-400"
                >
                  {searchTerm
                    ? "No players match your search criteria."
                    : "No players registered yet."}
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player, index) => (
                <tr
                  key={player.id || index}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-4 py-3 text-center font-bold text-slate-400">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white flex items-center space-x-2">
                    <span>{player.full_name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{player.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 font-mono text-xs">
                    {player.fide_id ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-900 rounded border border-slate-700">
                        <Shield className="w-3 h-3 text-indigo-400" />
                        <span>{player.fide_id}</span>
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-amber-400">
                    <div className="inline-flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{player.rating || 1200}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {player.status || "ACTIVE"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
