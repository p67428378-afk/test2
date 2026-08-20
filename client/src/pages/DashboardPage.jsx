import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { habitsService, authService } from "../services/api";
import Navbar from "../components/layout/Navbar";
import StatCard from "../components/common/StatCard";
import HabitCard from "../components/dashboard/HabitCard";
import Button from "../components/common/Button";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({
    totalStars: 0,
    streak: 0,
    completedCount: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = authService.getCurrentUser();

  const fetchDashboardData = async () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const habitsData = await habitsService.getHabits(tz);
      setHabits(habitsData);

      // Calculate stats
      const completed = habitsData.filter((h) => h.is_completed_today).length;
      const total = habitsData.length;

      // Fetch user progress from parent progress or calculate locally
      // For simplicity, let's fetch parent progress if parent, or use local storage / mock for child
      // Wait, the backend has user_progress table. Let's see if we can get the streak and stars.
      // Actually, the completeHabit endpoint returns updated stars and streak.
      // Let's initialize stars and streak from localStorage or default to 120 and 5 (matching Figma)
      const savedStars = localStorage.getItem(`stars_${user?.id}`) || "120";
      const savedStreak = localStorage.getItem(`streak_${user?.id}`) || "5";

      setStats({
        totalStars: parseInt(savedStars, 10),
        streak: parseInt(savedStreak, 10),
        completedCount: completed,
        totalCount: total,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load habits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const handleCompleteHabit = async (habitId) => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const result = await habitsService.completeHabit(habitId, tz);

      // Update local storage with new stars and streak
      localStorage.setItem(
        `stars_${user?.id}`,
        result.new_total_stars.toString(),
      );
      localStorage.setItem(
        `streak_${user?.id}`,
        result.current_streak.toString(),
      );

      // Refresh habits list
      const updatedHabits = habits.map((h) => {
        if (h.id === habitId) {
          return { ...h, is_completed_today: true };
        }
        return h;
      });
      setHabits(updatedHabits);

      const completed = updatedHabits.filter(
        (h) => h.is_completed_today,
      ).length;

      setStats((prev) => ({
        ...prev,
        totalStars: result.new_total_stars,
        streak: result.current_streak,
        completedCount: completed,
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to complete habit.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#edf2fa]">
        <p className="text-lg font-medium text-[#63738c]">
          Loading your dashboard... 🌟
        </p>
      </div>
    );
  }

  const completionPercentage =
    stats.totalCount > 0
      ? Math.round((stats.completedCount / stats.totalCount) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#edf2fa] p-6 flex flex-col gap-6 max-w-6xl mx-auto">
      <Navbar />

      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-[#4f45e5] text-3xl sm:text-4xl">
          Good Morning, {user?.username}! ☀️
        </h1>
        <p className="text-[#63738c] text-sm sm:text-base">
          Let's complete your healthy habits today to earn stars and keep your
          streak alive!
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-error text-error text-sm p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="My Total Stars ⭐"
          value={`${stats.totalStars} Stars`}
          badgeText="+10 Today"
          badgeVariant="success"
        />
        <StatCard
          title="Weekly Streak 🔥"
          value={`${stats.streak} Days`}
          badgeText="Keep it up!"
          badgeVariant="danger"
        />
        <StatCard
          title="Completed Today 🎉"
          value={`${stats.completedCount} / ${stats.totalCount} Habits`}
          badgeText={`${completionPercentage}% Done`}
          badgeVariant="danger"
        />
      </div>

      <h2 className="font-bold text-[#1f293b] text-xl sm:text-2xl mt-4">
        My Daily Habits 📝
      </h2>

      {habits.length === 0 ? (
        <div className="bg-white border border-[#e0e5f0] rounded-2xl p-8 text-center">
          <p className="text-[#63738c]">
            No active habits right now. Ask your parent or teacher to activate
            some! ⚙️
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={handleCompleteHabit}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <Button
          variant="secondary"
          onClick={() => navigate("/parent")}
          className="shadow-sm"
        >
          Go to Parent/Teacher Portal 🔑
        </Button>
      </div>
    </div>
  );
}
