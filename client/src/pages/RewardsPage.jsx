import React from "react";
import BadgeShowcaseGrid from "../components/rewards/BadgeShowcaseGrid.jsx";
import { Award, Flame, Star, Trophy } from "lucide-react";

export default function RewardsPage({ streakData, user }) {
  const badges = streakData?.badges || [];
  const totalPoints = streakData?.total_points ?? user?.total_points ?? 0;
  const currentStreak = streakData?.current_streak ?? 0;

  return (
    <div className="space-y-8">
      {/* Rewards Hero Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-xl text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
            <Trophy className="h-4 w-4" />
            <span>Reward Hall of Fame</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Your Health Hero Achievements 🏆
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed">
            Every habit logged and quiz passed brings you closer to unlocking
            exclusive new badges and reaching higher health level milestones!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-center">
            <Star className="h-6 w-6 text-emerald-400 fill-emerald-400/20 mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-emerald-400 block leading-tight">
              {totalPoints}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Total Points
            </span>
          </div>

          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-center">
            <Flame className="h-6 w-6 text-amber-500 fill-amber-500/20 mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-amber-400 block leading-tight">
              {currentStreak}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <BadgeShowcaseGrid userBadges={badges} totalPoints={totalPoints} />
    </div>
  );
}
