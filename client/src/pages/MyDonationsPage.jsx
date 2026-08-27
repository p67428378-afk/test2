import React, { useState, useEffect } from "react";
import { Heart, Calendar, ArrowRight, ShieldCheck, User } from "lucide-react";
import { Link } from "react-router-dom";
import { donationsAPI } from "../services/api";

export default function MyDonationsPage({ currentUser }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const fetchMyDonations = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await donationsAPI.getMyDonations({ limit: 50 });
        setDonations(data.items || []);
      } catch (err) {
        setError("Failed to load your donation history.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyDonations();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
        <p className="text-xs text-slate-500">
          Please sign in to view your personal donation history and contribution
          records.
        </p>
      </div>
    );
  }

  const totalContributed = donations.reduce(
    (acc, d) => acc + Number(d.amount || 0),
    0,
  );

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amt);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <span>Donor Profile</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">
            My Donation History
          </h1>
          <p className="text-blue-100 text-xs md:text-sm mt-1">
            Thank you,{" "}
            <strong className="text-white">
              {currentUser.full_name || currentUser.email}
            </strong>
            , for your generous support!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right min-w-[180px]">
          <p className="text-[10px] uppercase font-semibold tracking-wider text-blue-100">
            Total Lifetime Giving
          </p>
          <p className="text-2xl font-extrabold text-white mt-0.5">
            {formatCurrency(totalContributed)}
          </p>
        </div>
      </div>

      {/* Donations List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <span>Contributions ({donations.length})</span>
          </h2>
          <Link
            to="/"
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Explore More Campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse text-xs">
            Loading your contributions...
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              No contributions yet
            </p>
            <p className="text-xs text-slate-500">
              You haven't made any donations with this account yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm mt-2"
            >
              Browse Active Campaigns
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {donations.map((d) => (
              <div
                key={d.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">
                    {d.campaign_title || "General Campaign"}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="font-mono text-slate-400">
                      Tx: {d.transaction_id || d.id.substring(0, 8)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {d.created_at
                        ? new Date(d.created_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-emerald-600">
                      +{formatCurrency(d.amount)}
                    </div>
                    <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {d.payment_status || "Completed"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
