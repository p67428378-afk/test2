import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Bell, Share2, Rss, ArrowLeft, Check } from "lucide-react";

export default function ShowHeaderBanner({ podcast, episodeCount = 0 }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!podcast) return null;

  const {
    title,
    author,
    description,
    cover_image_url,
    category,
    total_subscribers = 0,
  } = podcast;

  const currentSubscribers = isSubscribed
    ? total_subscribers + 1
    : total_subscribers;
  const formattedSubscribers =
    currentSubscribers >= 1000
      ? `${(currentSubscribers / 1000).toFixed(1).replace(/\.0$/, "")}k`
      : currentSubscribers.toLocaleString();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#707a8c]">
        <Link
          to="/"
          className="hover:text-[#2663eb] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>›</span>
        <span>{category || "Catalog"}</span>
        <span>›</span>
        <span className="text-[#171c29] font-semibold truncate max-w-xs">
          {title}
        </span>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white border border-[#e3e8f0] p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
        {/* Cover Art */}
        <div className="relative shrink-0 w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-slate-100 shadow-md">
          <img
            src={
              cover_image_url ||
              "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=60"
            }
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=60";
            }}
          />
        </div>

        {/* Show Metadata & Actions */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#2663eb] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              {category || "General"}
            </span>
            <span className="bg-[#17a34a] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Daily Feed
            </span>
          </div>

          <h1 className="font-bold text-[#171c29] text-2xl md:text-3xl leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-[#707a8c] font-medium">
            <span>
              Hosted by{" "}
              <strong className="text-[#171c29]">{author || "Host"}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#2663eb]" />
              {formattedSubscribers} Subscribers
            </span>
            <span>•</span>
            <span>{episodeCount} Episodes Available</span>
          </div>

          <p className="text-sm text-[#171c29] leading-relaxed max-w-3xl">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                isSubscribed
                  ? "bg-slate-100 text-[#171c29] border border-[#e3e8f0]"
                  : "bg-[#2663eb] text-white hover:bg-blue-700"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{isSubscribed ? "Subscribed ✓" : "+ Subscribe"}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-medium bg-white border border-[#e3e8f0] text-[#171c29] hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#17a34a]" />
              ) : (
                <Share2 className="w-4 h-4 text-[#707a8c]" />
              )}
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>

            <div className="px-3 py-2 rounded-xl text-xs font-medium bg-[#f2f5fa] text-[#707a8c] flex items-center gap-1.5">
              <Rss className="w-3.5 h-3.5 text-orange-500" />
              <span>RSS Feed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
