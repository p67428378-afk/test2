import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Trophy,
  Users,
  GitMerge,
  Award,
  ShieldCheck,
  Plus,
  CheckCircle2,
} from "lucide-react";

export default function TournamentHeader({
  tournaments = [],
  activeTournament = null,
  onSelectTournament,
  onOpenRegisterModal,
  onFinishTournament,
}) {
  const location = useLocation();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                ChessMaster
              </span>
              <span className="text-xs text-indigo-400 font-medium">
                Swiss Tournament System
              </span>
            </div>
          </div>

          {/* Tournament Selector */}
          {tournaments.length > 0 && (
            <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <label
                htmlFor="tournament-select"
                className="text-xs text-slate-400 font-medium"
              >
                Tournament:
              </label>
              <select
                id="tournament-select"
                value={activeTournament?.id || ""}
                onChange={(e) => {
                  const selected = tournaments.find(
                    (t) => t.id === e.target.value,
                  );
                  if (selected && onSelectTournament) {
                    onSelectTournament(selected);
                  }
                }}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
              >
                {tournaments.map((t) => (
                  <option
                    key={t.id}
                    value={t.id}
                    className="bg-slate-900 text-slate-200"
                  >
                    {t.name} ({t.status})
                  </option>
                ))}
              </select>
              {activeTournament && (
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    activeTournament.status === "ACTIVE"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : activeTournament.status === "COMPLETED"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  R{activeTournament.current_round}/
                  {activeTournament.total_rounds}
                </span>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            {onOpenRegisterModal && (
              <button
                onClick={onOpenRegisterModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Register Player</span>
              </button>
            )}

            {activeTournament &&
              activeTournament.status !== "COMPLETED" &&
              onFinishTournament && (
                <button
                  onClick={onFinishTournament}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Finish & Certify</span>
                </button>
              )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-6 border-t border-slate-800 pt-2 pb-2 text-sm font-medium">
          <Link
            to="/"
            className={`inline-flex items-center space-x-2 py-1.5 border-b-2 transition-colors ${
              location.pathname === "/"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Dashboard & Roster</span>
          </Link>

          <Link
            to="/pairings"
            className={`inline-flex items-center space-x-2 py-1.5 border-b-2 transition-colors ${
              location.pathname === "/pairings"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitMerge className="w-4 h-4" />
            <span>Swiss Pairings</span>
          </Link>

          <Link
            to="/standings"
            className={`inline-flex items-center space-x-2 py-1.5 border-b-2 transition-colors ${
              location.pathname === "/standings"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Live Standings</span>
          </Link>

          <Link
            to="/verify"
            className={`inline-flex items-center space-x-2 py-1.5 border-b-2 transition-colors ${
              location.pathname.startsWith("/verify")
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Certificates</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
