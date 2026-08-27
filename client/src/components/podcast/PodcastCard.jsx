import React from "react";
import { Link } from "react-router-dom";
import { Users, Play, Radio } from "lucide-react";

export default function PodcastCard({ podcast }) {
  if (!podcast) return null;

  const {
    id,
    title,
    author,
    description,
    cover_image_url,
    category,
    total_subscribers = 0,
  } = podcast;

  const formattedSubscribers =
    total_subscribers >= 1000
      ? `${(total_subscribers / 1000).toFixed(1).replace(/\.0$/, "")}k`
      : total_subscribers.toLocaleString();

  return (
    <Link
      to={`/podcasts/${id}`}
      className="group bg-white border border-[#e3e8f0] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#2663eb]/40 transition-all flex flex-col justify-between"
      data-testid={`podcast-card-${id}`}
    >
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
          <img
            src={
              cover_image_url ||
              "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=60"
            }
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=60";
            }}
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#2663eb] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {category || "General"}
          </span>
        </div>

        <h3 className="font-bold text-[#171c29] text-base leading-snug group-hover:text-[#2663eb] transition-colors line-clamp-1 mb-1">
          {title}
        </h3>

        <p className="text-xs text-[#707a8c] font-medium mb-2">
          By {author || "Unknown Host"}
        </p>

        <p className="text-xs text-[#707a8c] line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-[#e3e8f0] flex items-center justify-between text-xs text-[#707a8c]">
        <div className="flex items-center gap-1.5 font-medium">
          <Users className="w-3.5 h-3.5 text-[#2663eb]" />
          <span>{formattedSubscribers} subscribers</span>
        </div>

        <span className="text-[#2663eb] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          View Episodes &rarr;
        </span>
      </div>
    </Link>
  );
}
