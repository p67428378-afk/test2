import React, { useState, useEffect } from "react";
import { Target, DollarSign, Flag, Percent, AlertTriangle } from "lucide-react";
import CampaignTable from "../components/admin/CampaignTable";
import { campaignsAPI } from "../services/api";

export default function AdminCampaignsPage({ currentUser }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await campaignsAPI.getCampaigns({
        status: "all",
        limit: 100,
      });
      setCampaigns(data.items || []);
    } catch (err) {
      setError(
        "Failed to fetch admin campaigns. Verify credentials or backend connectivity.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Compute KPI Stats
  const activeCount = campaigns.filter((c) => c.status === "Active").length;
  const totalRaised = campaigns.reduce(
    (acc, c) => acc + Number(c.current_amount || 0),
    0,
  );
  const totalTarget = campaigns.reduce(
    (acc, c) => acc + Number(c.target_amount || 0),
    0,
  );
  const goalRate =
    totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0;

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <span>Admin Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Campaign Management Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create new fundraising campaigns, edit campaign parameters, and
            modify live status.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Campaigns
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {activeCount}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Funds Raised
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {formatCurrency(totalRaised)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Target Goal
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {formatCurrency(totalTarget)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Goal Progress Rate
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {goalRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Admin Warning Banner if not Admin user */}
      {currentUser && currentUser.role !== "Admin" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You are logged in as a <strong>Donor</strong>. Admin operations
            (creating/editing/deleting) require an Admin account (e.g.{" "}
            <code>admin@example.com</code> / <code>adminpassword</code>).
          </span>
        </div>
      )}

      {/* Main Campaign Management Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 animate-pulse">
          Loading campaign management table...
        </div>
      ) : (
        <CampaignTable campaigns={campaigns} onRefresh={fetchCampaigns} />
      )}
    </div>
  );
}
