import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ContributionForm from "../components/campaigns/ContributionForm";
import { campaignsAPI, donationsAPI } from "../services/api";

export default function CampaignDetailsPage({ currentUser }) {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCampaignData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await campaignsAPI.getCampaign(id);
      setCampaign(data);

      // Load recent donations for this campaign
      try {
        const donData = await donationsAPI.getDonations({
          campaign_id: id,
          limit: 10,
        });
        setRecentDonations(donData.items || []);
      } catch (e) {
        // Non-blocking if admin restrictions or optional
      }
    } catch (err) {
      setError("Campaign not found or failed to load details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignData();
  }, [id]);

  const handleContributionSuccess = (newDonation) => {
    // Instant update raised amount & add to recent supporters
    if (campaign) {
      const addedAmt = Number(newDonation.amount || 0);
      setCampaign((prev) => ({
        ...prev,
        current_amount: Number(prev.current_amount || 0) + addedAmt,
        supporter_count: (prev.supporter_count || 0) + 1,
      }));
    }
    setRecentDonations((prev) => [newDonation, ...prev]);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-8 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-32 bg-slate-200 rounded" />
          </div>
          <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">
          {error || "Campaign not found"}
        </h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const current = Number(campaign.current_amount || 0);
  const target = Number(campaign.target_amount || 1);
  const percent = Math.min(100, Math.round((current / target) * 100));

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </Link>

      {/* Main Campaign Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-64 md:h-80 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 flex flex-col justify-between text-white relative">
          <div className="flex justify-between items-start">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
              {campaign.category || "General"}
            </span>
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {campaign.status}
            </span>
          </div>

          <div className="space-y-2 z-10 max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-sm">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-4 text-xs md:text-sm text-blue-100 font-medium">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {campaign.supporter_count || 0}{" "}
                Supporters
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Ends{" "}
                {campaign.end_date
                  ? new Date(campaign.end_date).toLocaleDateString()
                  : "Ongoing"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Header Bar */}
        <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 space-y-3">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {formatCurrency(current)}
              </span>
              <span className="text-slate-500 text-sm font-medium ml-2">
                raised of {formatCurrency(target)} goal
              </span>
            </div>
            <span className="text-lg font-bold text-blue-600">{percent}%</span>
          </div>

          <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Story & Recent Supporters */}
        <div className="lg:col-span-2 space-y-8">
          {/* Campaign Story */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              About this Campaign
            </h2>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {campaign.description}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Verified Giving Cause. 100% of contributions directly support
                campaign objectives.
              </span>
            </div>
          </div>

          {/* Recent Supporters List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span>Recent Supporters ({recentDonations.length})</span>
              </h3>
            </div>

            {recentDonations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Be the first supporter! Make a contribution to this campaign
                today.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentDonations.map((d) => (
                  <div
                    key={d.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {d.donor_name
                          ? d.donor_name.charAt(0).toUpperCase()
                          : "D"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {d.donor_name}
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          {d.created_at
                            ? new Date(d.created_at).toLocaleDateString()
                            : "Recently"}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-emerald-600 text-sm">
                      +${Number(d.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Contribution Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ContributionForm
              campaignId={campaign.id}
              campaignTitle={campaign.title}
              onSuccess={handleContributionSuccess}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
