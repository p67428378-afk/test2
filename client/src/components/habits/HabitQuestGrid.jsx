import React from "react";
import HabitCard from "./HabitCard.jsx";
import { Target } from "lucide-react";

export default function HabitQuestGrid({
  habits,
  completedHabitIds,
  onLogHabit,
}) {
  if (!habits || habits.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Target className="h-10 w-10 text-slate-500 mx-auto mb-3" />
        <p className="font-semibold text-slate-300">
          No habit quests available right now.
        </p>
        <p className="text-xs mt-1">
          Check back soon for new daily challenges!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-100">
            Daily Habit Quests
          </h2>
        </div>
        <span className="text-xs font-medium text-slate-400">
          {completedHabitIds.length} of {habits.length} Completed Today
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {habits.map((habit) => {
          const isCompleted = completedHabitIds.includes(habit.id);
          return (
            <HabitCard
              key={habit.id}
              habit={habit}
              completed={isCompleted}
              onLogHabit={onLogHabit}
            />
          );
        })}
      </div>
    </div>
  );
}
