import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parentService, authService } from "../services/api";
import Navbar from "../components/layout/Navbar";
import StatCard from "../components/common/StatCard";
import Card from "../components/common/Card";
import Checkbox from "../components/common/Checkbox";
import Button from "../components/common/Button";

export default function ParentPage() {
  const navigate = useNavigate();
  const [childrenProgress, setChildrenProgress] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const user = authService.getCurrentUser();

  const fetchParentData = async () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const progressData = await parentService.getProgress(tz);
      setChildrenProgress(progressData);

      const habitsData = await parentService.getHabitsAll();
      setHabits(habitsData);
    } catch (err) {
      console.error(err);
      setError("Failed to load parent portal data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "parent") {
      navigate("/");
      return;
    }
    fetchParentData();
  }, [user, navigate]);

  const handleToggleHabit = async (habitId, currentStatus) => {
    try {
      setError("");
      setSuccessMessage("");
      const updated = await parentService.toggleHabit(habitId, !currentStatus);

      setHabits((prev) =>
        prev.map((h) => {
          if (h.id === habitId) {
            return { ...h, is_active: updated.is_active };
          }
          return h;
        }),
      );

      setSuccessMessage(`Successfully updated habit: ${updated.name}`);

      // Refresh progress to update active habit count
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const progressData = await parentService.getProgress(tz);
      setChildrenProgress(progressData);
    } catch (err) {
      console.error(err);
      setError("Failed to update habit status.");
    }
  };

  const handleResetProgress = async (childId, childName) => {
    if (
      !window.confirm(
        `Are you sure you want to reset progress for ${childName}? This will clear all stars, streaks, and today's completions.`,
      )
    ) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      const result = await parentService.resetProgress(childId);

      // Clear local storage for this child
      localStorage.setItem(`stars_${childId}`, "0");
      localStorage.setItem(`streak_${childId}`, "0");

      setSuccessMessage(result.message);

      // Refresh progress
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const progressData = await parentService.getProgress(tz);
      setChildrenProgress(progressData);
    } catch (err) {
      console.error(err);
      setError("Failed to reset child progress.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#edf2fa]">
        <p className="text-lg font-medium text-[#63738c]">
          Loading parent portal... 🔑
        </p>
      </div>
    );
  }

  const totalKids = childrenProgress.length;
  const averageStars =
    childrenProgress.length > 0
      ? Math.round(
          childrenProgress.reduce((acc, curr) => acc + curr.total_stars, 0) /
            childrenProgress.length,
        )
      : 0;
  const activeHabitsCount = habits.filter((h) => h.is_active).length;
  const disabledHabitsCount = habits.filter((h) => !h.is_active).length;

  const getHabitIcon = (name) => {
    switch (name) {
      case "Brush Teeth":
        return "🪥";
      case "Wash Hands":
        return "🧼";
      case "Eat Veggies":
        return "🥕";
      case "Sleep on Time":
        return "🌙";
      default:
        return "📝";
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2fa] p-6 flex flex-col gap-6 max-w-6xl mx-auto">
      <Navbar />

      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-[#4f45e5] text-3xl sm:text-4xl">
          Parent/Teacher Configuration Portal 🔑
        </h1>
        <p className="text-[#63738c] text-sm sm:text-base">
          Manage active habits, view child progress, and reset star counts.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-error text-error text-sm p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-success text-success text-sm p-3 rounded-xl text-center">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Registered Kids 👶"
          value={`${totalKids} ${totalKids === 1 ? "Child" : "Children"}`}
          badgeText={childrenProgress[0]?.username || "None"}
          badgeVariant="danger"
        />
        <StatCard
          title="Average Stars ⭐"
          value={`${averageStars} Stars`}
          badgeText="Top Performer"
          badgeVariant="danger"
        />
        <StatCard
          title="Active Habits 📝"
          value={`${activeHabitsCount} Active`}
          badgeText={`${disabledHabitsCount} Disabled`}
          badgeVariant="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Main Column: Child Progress Summary */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <h2 className="font-bold text-[#1f293b] text-lg">
              Child Progress Summary 👶
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#edf2fa] text-[#63738c] font-medium text-xs uppercase tracking-wider">
                    <th className="p-3 rounded-l-xl">Child Name</th>
                    <th className="p-3">Total Stars</th>
                    <th className="p-3">Current Streak</th>
                    <th className="p-3">Completed Today</th>
                    <th className="p-3 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e5f0]">
                  {childrenProgress.map((child) => (
                    <tr
                      key={child.child_id}
                      className="hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="p-3 font-semibold text-[#1f293b]">
                        {child.username}
                      </td>
                      <td className="p-3 text-[#1f293b]">
                        {child.total_stars} Stars ⭐
                      </td>
                      <td className="p-3 text-[#1f293b]">
                        {child.current_streak} Days 🔥
                      </td>
                      <td className="p-3 text-[#1f293b]">
                        {child.completed_today_count} /{" "}
                        {child.total_active_habits} Habits
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() =>
                            handleResetProgress(child.child_id, child.username)
                          }
                          className="text-xs text-error hover:underline font-bold flex items-center gap-1 ml-auto"
                        >
                          Reset Progress 🔄
                        </button>
                      </td>
                    </tr>
                  ))}
                  {childrenProgress.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-4 text-center text-[#63738c]"
                      >
                        No children registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Side Column: Manage Active Habits */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <h2 className="font-bold text-[#1f293b] text-lg">
              Manage Active Habits ⚙️
            </h2>
            <div className="flex flex-col gap-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-[#f2f5fa] border border-[#e0e5f0] flex items-center justify-between p-3 rounded-xl hover:bg-[#e0e5f0] transition-colors"
                >
                  <p className="font-medium text-[#1f293b] text-sm">
                    {getHabitIcon(habit.name)} {habit.name}
                  </p>
                  <Checkbox
                    id={`toggle-${habit.id}`}
                    checked={habit.is_active}
                    onChange={() =>
                      handleToggleHabit(habit.id, habit.is_active)
                    }
                    label={habit.is_active ? "Active" : "Inactive"}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
