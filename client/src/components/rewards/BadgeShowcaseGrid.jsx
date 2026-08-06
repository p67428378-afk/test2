import React from "react";
import {
  Award,
  Lock,
  Sparkles,
  Star,
  Trophy,
  Shield,
  Heart,
  Zap,
} from "lucide-react";

const ICON_MAP = {
  award: Award,
  trophy: Trophy,
  star: Star,
  sparkles: Sparkles,
  shield: Shield,
  heart: Heart,
  zap: Zap,
};

export default function BadgeShowcaseGrid({
  userBadges = [],
  totalPoints = 0,
}) {
  // Pre-defined milestone badges catalog
  const defaultMilestones = [
    {
      id: "starter",
      name: "First Step Hero",
      description: "Complete your first health habit log",
      required_points: 10,
      icon_key: "star",
    },
    {
      id: "hydration",
      name: "Hydration Master",
      description: "Log hydration habits for 3 consecutive days",
      required_points: 30,
      icon_key: "zap",
    },
    {
      id: "hygiene",
      name: "Clean Champion",
      description: "Master daily personal hygiene routines",
      required_points: 50,
      icon_key: "shield",
    },
    {
      id: "health_hero",
      name: "Health Hero",
      description: "Reach 100 total habit reward points",
      required_points: 100,
      icon_key: "trophy",
    },
    {
      id: "super_star",
      name: "Super Routine Star",
      description: "Maintain an active 7-day streak",
      required_points: 200,
      icon_key: "sparkles",
    },
    {
      id: "wellness_legend",
      name: "Wellness Legend",
      description: "Earn 500 lifetime wellness points",
      required_points: 500,
      icon_key: "heart",
    },
  ];

  // Map unlocked badge names / IDs from backend response
  const unlockedNames = (userBadges || []).map((b) =>
    (b.name || b.icon_key || "").toLowerCase(),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span>Achievement Badges Showcase</span>
          </h2>
          <p className="text-xs text-slate-400">
            Earn points by logging habits and quizzes to unlock awesome badges!
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
          {userBadges.length} Badges Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {defaultMilestones.map((badge) => {
          const isUnlocked =
            unlockedNames.includes(badge.name.toLowerCase()) ||
            unlockedNames.includes(badge.id.toLowerCase()) ||
            totalPoints >= badge.required_points;

          const IconComponent = ICON_MAP[badge.icon_key] || Award;

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? "bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5"
                  : "bg-slate-900/50 border-slate-800 opacity-75"
              }`}
            >
              {isUnlocked && (
                <div className="absolute right-0 top-0 -mt-2 -mr-2 h-16 w-16 bg-amber-500/10 rounded-full blur-xl" />
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                      isUnlocked
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                    }`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isUnlocked
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {isUnlocked
                      ? "Unlocked"
                      : `Requires ${badge.required_points} pts`}
                  </span>
                </div>

                <h3
                  className={`font-bold text-base mb-1 ${isUnlocked ? "text-amber-300" : "text-slate-300"}`}
                >
                  {badge.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                {isUnlocked ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Badge Unlocked!
                  </span>
                ) : (
                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5" />
                    Locked Milestone
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
