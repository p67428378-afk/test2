import React from "react";
import DailyChallengeBanner from "../components/habits/DailyChallengeBanner.jsx";
import HabitQuestGrid from "../components/habits/HabitQuestGrid.jsx";
import StreakWeeklyTracker from "../components/habits/StreakWeeklyTracker.jsx";

// API Endpoint Reference: GET /api/v1/users/{user_id}/streaks

export default function DashboardPage({
  habits,
  completedHabitIds,
  streakData,
  onLogHabit,
  onNavigateToLessons,
}) {
  return (
    <div className="space-y-8">
      {/* Daily Challenge Banner */}
      <DailyChallengeBanner
        totalCompleted={completedHabitIds.length}
        totalHabits={habits?.length || 4}
        onExploreLessons={onNavigateToLessons}
      />

      {/* Main Grid: Habit Quests (Left) & Streak Tracker (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HabitQuestGrid
            habits={habits}
            completedHabitIds={completedHabitIds}
            onLogHabit={onLogHabit}
          />
        </div>

        <div>
          <StreakWeeklyTracker streakData={streakData} />
        </div>
      </div>
    </div>
  );
}
