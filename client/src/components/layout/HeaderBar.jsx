import React from "react";
import { Flame, Star, ShieldCheck, ShieldAlert } from "lucide-react";

// Endpoint Contract Reference: GET /api/v1/users/{user_id}/streaks
export const STREAKS_URL = "/api/v1/users/{user_id}/streaks";

export default function HeaderBar({ user, streakData }) {
  const currentStreak = streakData?.current_streak ?? 0;
  const totalPoints = streakData?.total_points ?? user?.total_points ?? 0;
  const isParentVerified =
    user?.is_parent_verified ?? streakData?.is_parent_verified ?? false;

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 text-slate-100">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
          Hi, {user?.full_name || "Champion"}! 👋
        </h2>
        <p className="text-xs text-slate-400">
          Ready to build your healthy habits today?
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Streak Flame Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
          <Flame className="h-5 w-5 fill-amber-500 text-amber-500 animate-pulse" />
          <div className="text-left">
            <span className="text-xs text-slate-400 block leading-3">
              Streak
            </span>
            <span className="font-bold text-sm leading-4">
              {currentStreak} Days
            </span>
          </div>
        </div>

        {/* Total Points Balance */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          <Star className="h-5 w-5 fill-emerald-400 text-emerald-400" />
          <div className="text-left">
            <span className="text-xs text-slate-400 block leading-3">
              Points
            </span>
            <span className="font-bold text-sm leading-4">
              {totalPoints} pts
            </span>
          </div>
        </div>

        {/* COPPA Parent Verification Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            isParentVerified
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}
          title={
            isParentVerified
              ? "Parental Consent Verified (COPPA Compliant)"
              : "Guest Mode / Pending Parent Verification"
          }
        >
          {isParentVerified ? (
            <>
              <ShieldCheck className="h-4 w-4" />
              <span>Parent Verified</span>
            </>
          ) : (
            <>
              <ShieldAlert className="h-4 w-4" />
              <span>Guest / Consent Needed</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
