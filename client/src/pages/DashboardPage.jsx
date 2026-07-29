import React, { useEffect, useState } from "react";
import {
  Sparkles,
  List,
  Smartphone,
  Wallet,
  Headphones,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { itemService, claimService, authService } from "../services/api";
import MatchCard from "../components/items/MatchCard.jsx";
import Modal from "../components/common/Modal.jsx";
import Button from "../components/common/Button.jsx";

export default function DashboardPage() {
  const [myItems, setMyItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState(null);
  const [claimDescription, setClaimDescription] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const user = authService.getCurrentUser();

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all found items to filter or simulate user's items
      const foundData = await itemService.getFoundItems({ limit: 100 });

      // Since we don't have a specific "get my items" endpoint, we can filter items by user_id
      const userItems = foundData.items.filter(
        (item) => item.user_id === user?.id,
      );
      setMyItems(userItems);

      // Find matches for any lost items the user has reported
      const lostItems = userItems.filter(
        (item) => item.status === "reported_lost",
      );
      const allMatches = [];
      for (const lostItem of lostItems) {
        try {
          const matchData = await itemService.getLostItemMatches(lostItem.id);
          if (matchData.matches) {
            matchData.matches.forEach((m) => {
              allMatches.push({
                ...m,
                lostItem,
              });
            });
          }
        } catch (err) {
          // Ignore individual match fetch errors
        }
      }
      setMatches(allMatches);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemForClaim) return;

    setClaimLoading(true);
    setClaimError(null);
    setClaimSuccess(false);

    try {
      await claimService.createClaim({
        item_id: selectedItemForClaim.id,
        claimant_description: claimDescription,
      });
      setClaimSuccess(true);
      setClaimDescription("");
      setTimeout(() => {
        setSelectedItemForClaim(null);
        setClaimSuccess(false);
        fetchDashboardData();
      }, 2000);
    } catch (err) {
      setClaimError(
        err.response?.data?.detail ||
          "Failed to submit claim. Please try again.",
      );
    } finally {
      setClaimLoading(false);
    }
  };

  const lostCount = myItems.filter(
    (item) => item.status === "reported_lost",
  ).length;
  const foundCount = myItems.filter(
    (item) => item.status === "reported_found",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-white">Overview</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your reported items and active claims.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[#6366F1]">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-400">My Reported Lost</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-white">{lostCount}</span>
            <span className="text-xs text-slate-400 mb-1">active status</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[#6366F1]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-400">My Reported Found</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-white">{foundCount}</span>
            <span className="text-xs text-slate-400 mb-1">active status</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <List className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-400">Active Claims</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-white">2</span>
            <span className="bg-indigo-500/10 border border-amber-500 text-amber-400 text-xs px-2 py-1 rounded mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Suggested Matches */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="text-[#6366F1] w-5 h-5" />
            AI Suggested Matches
          </h3>

          {matches.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-slate-600" />
              <p className="text-sm">No AI matches found yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Report a lost item to see matches here.
              </p>
            </div>
          ) : (
            matches.map((match) => (
              <MatchCard
                key={match.item.id}
                match={match}
                lostItem={match.lostItem}
                onClaim={(item) => setSelectedItemForClaim(item)}
              />
            ))
          )}
        </div>

        {/* Recent Reports */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <List className="text-slate-400 w-5 h-5" />
              Recent Reports
            </h3>
          </div>

          <div className="glass-card rounded-xl p-1 overflow-hidden divide-y divide-slate-800">
            {myItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No recent reports.
              </div>
            ) : (
              myItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-800/20 transition-colors flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-white truncate">
                        {item.name}
                      </p>
                      <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs capitalize shrink-0">
                        {item.status?.replace("reported_", "")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Reported: {item.item_date}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <Modal
        isOpen={!!selectedItemForClaim}
        onClose={() => setSelectedItemForClaim(null)}
        title={`Claim: ${selectedItemForClaim?.name}`}
      >
        {claimSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center">
            Claim submitted successfully! Pending admin verification.
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="space-y-4">
            {claimError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {claimError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Proof of Ownership *
              </label>
              <textarea
                required
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                placeholder="Please describe unique features, serial numbers, or purchase details to verify ownership."
                rows="4"
                className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                onClick={() => setSelectedItemForClaim(null)}
                variant="secondary"
                disabled={claimLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="success" disabled={claimLoading}>
                {claimLoading ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
