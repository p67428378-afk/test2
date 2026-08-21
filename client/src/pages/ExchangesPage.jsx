import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import StatCardGroup from "../components/StatCardGroup.jsx";
import ExchangeDashboard from "../components/ExchangeDashboard.jsx";
import {
  getProfile,
  getExchangeRequests,
  updateExchangeStatus,
  getMatches,
} from "../services/api.js";
import { ArrowRightLeft } from "lucide-react";

export default function ExchangesPage() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [pendingExchangesCount, setPendingExchangesCount] = useState(0);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileAndStats = async () => {
    try {
      const profData = await getProfile();
      setProfile(profData);
    } catch (e) {
      console.warn("Failed to load profile:", e);
    }

    try {
      const matchesData = await getMatches({ limit: 100 });
      setMatchesCount(matchesData?.length || 0);
    } catch (e) {
      console.warn("Failed to load matches:", e);
    }
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (roleFilter && roleFilter !== "all") params.role_filter = roleFilter;
      if (statusFilter) params.status_filter = statusFilter;

      const data = await getExchangeRequests(params);
      setRequests(data || []);

      // Calculate pending count
      const pendingItems = (data || []).filter((r) => r.status === "PENDING");
      setPendingExchangesCount(pendingItems.length);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [roleFilter, statusFilter]);

  const handleStatusUpdate = async (requestId, action) => {
    await updateExchangeStatus(requestId, action);
    await fetchRequests();
    await fetchProfileAndStats();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Skill Exchange Request Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage incoming and outgoing exchange proposals. Accept to
                unlock contact details.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Metrics */}
        <StatCardGroup
          teachCount={profile?.teach_skills?.length || 0}
          learnCount={profile?.learn_skills?.length || 0}
          matchesCount={matchesCount}
          pendingExchangesCount={pendingExchangesCount}
        />

        {/* Exchange Dashboard Component */}
        <ExchangeDashboard
          requests={requests}
          isLoading={isLoading}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
          onStatusUpdate={handleStatusUpdate}
        />
      </main>
    </div>
  );
}
