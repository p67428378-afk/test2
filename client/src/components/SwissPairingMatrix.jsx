import React, { useState } from "react";
import {
  GitMerge,
  Trophy,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { pairingService, scoreService } from "../services/api";

export default function SwissPairingMatrix({
  activeTournament = null,
  rounds = [],
  onPairingsUpdated,
}) {
  const [selectedRoundNum, setSelectedRoundNum] = useState(
    rounds.length > 0 ? rounds[rounds.length - 1].round_number : 1,
  );
  const [loading, setLoading] = useState(false);
  const [submittingMatchId, setSubmittingMatchId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const activeRound =
    rounds.find((r) => r.round_number === Number(selectedRoundNum)) ||
    (rounds.length > 0 ? rounds[rounds.length - 1] : null);

  const handleGeneratePairings = async () => {
    if (!activeTournament) {
      setErrorMsg("No active tournament selected.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const newRound = await pairingService.generatePairings(
        activeTournament.id,
      );
      setSuccessMsg(
        `Round ${newRound.round_number} pairings generated successfully!`,
      );
      setSelectedRoundNum(newRound.round_number);
      if (onPairingsUpdated) {
        onPairingsUpdated();
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail || "Failed to generate Swiss pairings.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = async (matchId, newResult) => {
    setErrorMsg("");
    setSuccessMsg("");
    setSubmittingMatchId(matchId);

    try {
      await scoreService.submitScore(matchId, newResult);
      setSuccessMsg(`Result '${newResult}' recorded for match.`);
      if (onPairingsUpdated) {
        onPairingsUpdated();
      }
    } catch (err) {
      const detail = err.response?.data?.detail || "Failed to submit score.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setSubmittingMatchId(null);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl text-slate-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
            <GitMerge className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Swiss Pairing Matrix
            </h2>
            <p className="text-xs text-slate-400">
              FIDE Swiss engine matching score groups & balancing colors
            </p>
          </div>
        </div>

        <button
          onClick={handleGeneratePairings}
          disabled={loading || !activeTournament}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Calculating..." : "Auto-Pair Next Round"}</span>
        </button>
      </div>

      {/* Status Banners */}
      {errorMsg && (
        <div
          role="alert"
          className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start space-x-2 text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Round Tabs */}
      {rounds.length > 0 && (
        <div className="mt-6 flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-700/50">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            Rounds:
          </span>
          {rounds.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoundNum(r.round_number)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeRound?.round_number === r.round_number
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              Round {r.round_number} {r.is_closed ? "✓" : ""}
            </button>
          ))}
        </div>
      )}

      {/* Match Matrix */}
      <div className="mt-6">
        {!activeRound ||
        !activeRound.matches ||
        activeRound.matches.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-dashed border-slate-700">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">
              No pairings for this round yet.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Click "Auto-Pair Next Round" above to generate pairings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRound.matches.map((match) => {
              const isSubmitting = submittingMatchId === match.id;

              if (match.is_bye) {
                return (
                  <div
                    key={match.id}
                    className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-md"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-500">
                          Board {match.board_number || 1}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded border border-amber-500/30">
                          BYE ASSIGNED
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white mt-1">
                        {match.white_player_name || "Bye Recipient"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                        +1.0 Point
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={match.id}
                  className="bg-slate-900/80 border border-slate-700 hover:border-slate-600 rounded-xl p-4 shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-400">
                      Board #{match.board_number}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        match.result === "PENDING"
                          ? "bg-slate-800 text-slate-400"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {match.result === "PENDING"
                        ? "In Progress"
                        : `Result: ${match.result}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* White Player */}
                    <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/80">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-400 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          White
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white truncate">
                        {match.white_player_name || "Player White"}
                      </p>
                    </div>

                    {/* Black Player */}
                    <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/80">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Black
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white truncate">
                        {match.black_player_name || "Player Black"}
                      </p>
                    </div>
                  </div>

                  {/* Result Buttons */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                      Record Result:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleResultChange(match.id, "1-0")}
                        disabled={isSubmitting}
                        className={`py-1.5 text-xs font-bold rounded transition-colors ${
                          match.result === "1-0"
                            ? "bg-emerald-600 text-white shadow"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        1 - 0
                      </button>
                      <button
                        onClick={() => handleResultChange(match.id, "0.5-0.5")}
                        disabled={isSubmitting}
                        className={`py-1.5 text-xs font-bold rounded transition-colors ${
                          match.result === "0.5-0.5"
                            ? "bg-amber-600 text-white shadow"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        ½ - ½
                      </button>
                      <button
                        onClick={() => handleResultChange(match.id, "0-1")}
                        disabled={isSubmitting}
                        className={`py-1.5 text-xs font-bold rounded transition-colors ${
                          match.result === "0-1"
                            ? "bg-indigo-600 text-white shadow"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        0 - 1
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
