import React, { useState, useEffect } from "react";
import TournamentHeader from "../components/TournamentHeader";
import SwissPairingMatrix from "../components/SwissPairingMatrix";
import { tournamentService, pairingService } from "../services/api";

export default function PairingsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await tournamentService.getTournaments();
      setTournaments(list);
      if (list.length > 0) {
        const active = activeTournament
          ? list.find((t) => t.id === activeTournament.id) || list[0]
          : list[0];
        setActiveTournament(active);
        if (active) {
          const rList = await pairingService.getRounds(active.id);
          setRounds(rList);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectTournament = async (tournament) => {
    setActiveTournament(tournament);
    try {
      const rList = await pairingService.getRounds(tournament.id);
      setRounds(rList);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TournamentHeader
        tournaments={tournaments}
        activeTournament={activeTournament}
        onSelectTournament={handleSelectTournament}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SwissPairingMatrix
          activeTournament={activeTournament}
          rounds={rounds}
          onPairingsUpdated={loadData}
        />
      </main>
    </div>
  );
}
