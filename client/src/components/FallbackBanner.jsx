import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FallbackBanner({
  message = "Showing our top-rated popular picks across the catalog.",
}) {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-violet-500/10 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 mt-0.5 sm:mt-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <span>Popular Trending Products</span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
              Fallback
            </span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {message} Customize your profile for pinpoint AI recommendations
            tailored to your exact budget & style.
          </p>
        </div>
      </div>

      <Link
        to="/preferences"
        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-700 border border-indigo-200 shadow-sm hover:bg-indigo-50 transition-colors shrink-0"
      >
        <span>Set Preferences</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
