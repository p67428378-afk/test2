import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import StatCardGroup from "../components/StatCardGroup.jsx";
import MatchExplorer from "../components/MatchExplorer.jsx";
import ExchangeRequestModal from "../components/ExchangeRequestModal.jsx";
import {
  getProfile,
  getMatches,
  createExchangeRequest,
  getExchangeRequests,
} from "../services/api.js";
import { Sparkles } from "lucide-react";

export default function DiscoveryPage() {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [pendingExchangesCount, setPendingExchangesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchProfileAndStats = async () => {
    try {
      const profData = await getProfile();
      setProfile(profData);
    } catch (e) {
      console.warn("Failed to load profile:", e);
    }

    try {
      const exchangesData = await getExchangeRequests({
        status_filter: "PENDING",
      });
      setPendingExchangesCount(exchangesData?.length || 0);
    } catch (e) {
      console.warn("Failed to load pending exchanges:", e);
    }
  };

  const fetchMatches = async (params = {}) => {
    setIsLoading(true);
    try {
      const data = await getMatches(params);
      setMatches(data || []);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
    fetchMatches();
  }, []);

  const handleOpenModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const handleSubmitRequest = async (requestPayload) => {
    await createExchangeRequest(requestPayload);
    setNotification({
      type: "success",
      message: `Exchange request successfully sent to ${selectedMatch?.partner_name}!`,
    });
    setTimeout(() => setNotification(null), 4000);
    await fetchProfileAndStats();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Automated Skill Intersection Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover Your Skill Exchange Partners
          </h1>
          <p className="text-sm text-blue-100 mt-2 max-w-2xl">
            Find peers who want to learn what you can teach and offer the exact
            skills you want to master. Filter by proficiency and reciprocal
            matches.
          </p>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-sm">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-600 hover:text-emerald-900 font-bold ml-4"
            >
              &times;
            </button>
          </div>
        )}

        {/* KPI Metrics */}
        <StatCardGroup
          teachCount={profile?.teach_skills?.length || 0}
          learnCount={profile?.learn_skills?.length || 0}
          matchesCount={matches.length}
          pendingExchangesCount={pendingExchangesCount}
        />

        {/* Match Explorer */}
        <MatchExplorer
          matches={matches}
          isLoading={isLoading}
          onSearch={fetchMatches}
          onRequestExchange={handleOpenModal}
        />

        {/* Exchange Request Creation Modal */}
        <ExchangeRequestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          matchData={selectedMatch}
          userTeachSkills={profile?.teach_skills || []}
          onSubmitRequest={handleSubmitRequest}
        />
      </main>
    </div>
  );
}
