import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Apple,
  Activity,
  Sparkles,
  Moon,
  Award,
} from "lucide-react";

const CATEGORY_ICONS = {
  nutrition: Apple,
  activity: Activity,
  exercise: Activity,
  hygiene: Sparkles,
  sleep: Moon,
  rest: Moon,
};

const CATEGORY_COLORS = {
  nutrition: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  activity: "bg-sky-500/10 border-sky-500/30 text-sky-400",
  exercise: "bg-sky-500/10 border-sky-500/30 text-sky-400",
  hygiene: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  sleep: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  rest: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
};

export default function HabitCard({ habit, completed, onLogHabit }) {
  const [loading, setLoading] = useState(false);

  const categoryKey = (habit.category || "nutrition").toLowerCase();
  const IconComponent = CATEGORY_ICONS[categoryKey] || Sparkles;
  const badgeStyle =
    CATEGORY_COLORS[categoryKey] ||
    "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";

  const handleToggle = async () => {
    if (completed || loading) return;
    setLoading(true);
    try {
      await onLogHabit(habit.id);
    } catch (err) {
      console.error("Error logging habit:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        completed
          ? "bg-slate-900/40 border-emerald-500/40 shadow-emerald-500/5 shadow-lg"
          : "bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md"
      }`}
    >
      <div>
        {/* Top bar with category badge & point reward */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold uppercase tracking-wider ${badgeStyle}`}
          >
            <IconComponent className="h-3.5 w-3.5" />
            {habit.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="h-3.5 w-3.5" />+{habit.points_value || 10} pts
          </span>
        </div>

        {/* Habit Title & Description */}
        <h3
          className={`font-bold text-lg mb-1 ${completed ? "line-through text-slate-400" : "text-slate-100"}`}
        >
          {habit.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4">
          {habit.description ||
            "Complete this healthy habit today to build your streak!"}
        </p>
      </div>

      {/* Completion Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={completed || loading}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
          completed
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md hover:shadow-emerald-500/20"
        }`}
      >
        {completed ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>Completed Today!</span>
          </>
        ) : loading ? (
          <span>Saving...</span>
        ) : (
          <>
            <Circle className="h-5 w-5" />
            <span>Mark Complete</span>
          </>
        )}
      </button>
    </div>
  );
}
