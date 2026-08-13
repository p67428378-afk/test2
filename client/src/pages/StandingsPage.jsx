import React, { useState, useEffect } from "react";
import TournamentHeader from "../components/TournamentHeader";
import LiveLeaderboardTable from "../components/LiveLeaderboardTable";
import { tournamentService, standingsService } from "../services/api";

export default function StandingsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTournaments = async () => {
    try {
      const list = await tournamentService.getTournaments();
      setTournaments(list);
      if (list.length > 0) {
        const active = activeTournament
          ? list.find((t) => t.id === activeTournament.id) || list[0]
          : list[0];
        setActiveTournament(active);
        if (active) {
          loadStandings(active.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadStandings = async (tournamentId) => {
    if (!tournamentId) return;
    setLoading(true);
    try {
      const data = await standingsService.getStandings(tournamentId);
      setStandings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const handleSelectTournament = (t) => {
    setActiveTournament(t);
    loadStandings(t.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TournamentHeader
        tournaments={tournaments}
        activeTournament={activeTournament}
        onSelectTournament={handleSelectTournament}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <LiveLeaderboardTable
          standings={standings}
          loading={loading}
          onRefresh={() =>
            activeTournament && loadStandings(activeTournament.id)
          }
        />
      </main>
    </div>
  );
}
