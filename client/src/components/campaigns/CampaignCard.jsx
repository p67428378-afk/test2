import React from "react";
import { Link } from "react-router-dom";
import { Heart, Users, Calendar, ArrowRight } from "lucide-react";

export default function CampaignCard({ campaign }) {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "Ongoing";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Paused":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden h-full">
      {/* Category Header Banner / Image Placeholder */}
      <div className="h-44 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative flex flex-col justify-between text-white">
        <div className="flex justify-between items-start z-10">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
            {campaign.category || "General"}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(campaign.status)}`}
          >
            {campaign.status}
          </span>
        </div>
        <div className="z-10">
          <h3 className="font-bold text-xl line-clamp-2 leading-snug drop-shadow-sm">
            {campaign.title}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {campaign.description}
        </p>

        {/* Financial Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline text-sm">
            <span className="font-bold text-slate-900 text-lg">
              {formatCurrency(current)}
            </span>
            <span className="text-slate-500 text-xs font-medium">
              of {formatCurrency(target)} ({percent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Stats Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{campaign.supporter_count || 0} Supporters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>End: {formatDate(campaign.end_date)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to={`/campaigns/${campaign.id}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors group"
          >
            <span>Contribute Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
