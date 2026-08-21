import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import StatCardGroup from "../components/StatCardGroup.jsx";
import SkillProfileEditor from "../components/SkillProfileEditor.jsx";
import {
  getProfile,
  addSkill,
  removeSkill,
  getMatches,
  getExchangeRequests,
} from "../services/api.js";
import { RefreshCw, User, GraduationCap } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [pendingExchangesCount, setPendingExchangesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profData = await getProfile();
      setProfile(profData);

      try {
        const matchesData = await getMatches({ limit: 100 });
        setMatchesCount(matchesData?.length || 0);
      } catch (e) {
        console.warn("Matches fetch error:", e);
      }

      try {
        const exchangesData = await getExchangeRequests({
          status_filter: "PENDING",
        });
        setPendingExchangesCount(exchangesData?.length || 0);
      } catch (e) {
        console.warn("Exchanges fetch error:", e);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to load profile",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSkill = async (skillData) => {
    await addSkill(skillData);
    await loadData();
  };

  const handleRemoveSkill = async (userSkillId) => {
    await removeSkill(userSkillId);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* User Hero Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/20">
              {profile?.full_name
                ? profile.full_name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {profile?.full_name || "Skill Exchange User"}
              </h1>
              <p className="text-sm text-slate-500">
                {profile?.email || "test@example.com"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Profile Active
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={loadData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Profile</span>
          </button>
        </div>

        {/* KPI Metrics */}
        <StatCardGroup
          teachCount={profile?.teach_skills?.length || 0}
          learnCount={profile?.learn_skills?.length || 0}
          matchesCount={matchesCount}
          pendingExchangesCount={pendingExchangesCount}
        />

        {/* Skill Profile Editor */}
        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">
              Loading skill profile...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
            <p className="font-semibold mb-2">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <SkillProfileEditor
            profile={profile}
            onSkillAdded={handleAddSkill}
            onSkillRemoved={handleRemoveSkill}
          />
        )}
      </main>
    </div>
  );
}
