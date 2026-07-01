import React from "react";
import { Star, Award } from "lucide-react";

export default function Header({ user, points, onResetUser }) {
  const level = Math.floor(points / 500) + 1;
  const pointsInLevel = points % 500;

  return (
    <header className="h-[80px] w-full top-0 sticky shadow-[0_4px_0_0_rgba(0,0,0,0.05)] bg-white dark:bg-slate-900 flex justify-between items-center px-4 md:px-12 z-50">
      {/* Logo Area */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={onResetUser}
      >
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl sticker-badge -rotate-2">
          HQ
        </div>
        <h1 className="font-bold text-2xl text-primary dark:text-primary-fixed tracking-tight">
          HealthQuest
        </h1>
      </div>

      {/* Center: Progress Bar */}
      <div className="hidden md:flex items-center bg-slate-50 rounded-full px-4 py-2 border-2 border-primary/10 shadow-inner w-1/3 max-w-md">
        <Star className="text-amber-500 mr-2 fill-amber-500" size={20} />
        <div className="flex-grow">
          <div className="flex justify-between text-xs font-bold text-primary mb-1">
            <span>Level {level} Explorer</span>
            <span>{pointsInLevel} / 500</span>
          </div>
          <div className="h-4 bg-primary/20 rounded-full overflow-hidden w-full relative">
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(pointsInLevel / 500) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-amber-100 rounded-xl px-4 py-2 border-2 border-amber-200 shadow-sm">
          <Award className="text-amber-600 fill-amber-500" size={20} />
          <span className="font-bold text-amber-900">{points} Points</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">
              {user?.username || "Guest"}
            </p>
            <button
              onClick={onResetUser}
              className="text-xs text-primary hover:underline"
            >
              Switch User
            </button>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-white shadow-md overflow-hidden bg-sky-100 flex items-center justify-center text-2xl">
            🐻
          </div>
        </div>
      </div>
    </header>
  );
}
