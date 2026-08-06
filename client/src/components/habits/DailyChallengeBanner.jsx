import React from "react";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";

export default function DailyChallengeBanner({
  totalCompleted,
  totalHabits,
  onExploreLessons,
}) {
  const progressPercent =
    totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 shadow-xl text-slate-100">
      <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Daily Health Challenge</span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Supercharge Your Daily Routine! 🚀
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Complete all 4 daily health habits (Hydration, Exercise, Hygiene,
            and Sleep) to earn bonus points and unlock special achievement
            badges!
          </p>

          {/* Progress Bar */}
          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Goal Progress</span>
              <span className="text-emerald-400">
                {progressPercent}% Completed
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
          <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-center flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-400 fill-amber-400/20" />
            <div className="text-left">
              <span className="text-xs text-slate-400 block">Reward Goal</span>
              <span className="font-bold text-sm text-emerald-400">
                +50 Bonus Points
              </span>
            </div>
          </div>

          {onExploreLessons && (
            <button
              onClick={onExploreLessons}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs transition-colors shadow-md"
            >
              <span>Take Quiz Lessons</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
