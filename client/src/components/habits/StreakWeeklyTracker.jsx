import React from "react";
import { Flame, Calendar, Award } from "lucide-react";

export default function StreakWeeklyTracker({ streakData }) {
  const currentStreak = streakData?.current_streak ?? 0;
  const longestStreak = streakData?.longest_streak ?? 0;
  const totalPoints = streakData?.total_points ?? 0;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // For demonstration, highlight days active based on current streak length
  const activeDaysCount = Math.min(currentStreak, 7);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-amber-500 fill-amber-500" />
          <h2 className="text-lg font-bold text-slate-100">
            Streak & Weekly Progress
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Best: {longestStreak} Days
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800/60 border border-slate-800 rounded-xl text-center">
          <span className="text-xs text-slate-400 block mb-1">
            Current Streak
          </span>
          <span className="text-3xl font-extrabold text-amber-400">
            {currentStreak}
          </span>
          <span className="text-xs text-slate-400 block mt-1">
            Consecutive Days
          </span>
        </div>

        <div className="p-4 bg-slate-800/60 border border-slate-800 rounded-xl text-center">
          <span className="text-xs text-slate-400 block mb-1">
            Total Earned
          </span>
          <span className="text-3xl font-extrabold text-emerald-400">
            {totalPoints}
          </span>
          <span className="text-xs text-slate-400 block mt-1">
            Health Points
          </span>
        </div>
      </div>

      {/* 7-Day Check-in Status Dots */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            7-Day Activity Check
          </span>
          <span>{activeDaysCount} / 7 Active</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, index) => {
            const isActive = index < activeDaysCount;
            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${
                    isActive
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-sm"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                >
                  {isActive ? "🔥" : index + 1}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
