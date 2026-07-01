import React, { useState, useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import NutritionGamePage from "./pages/NutritionGamePage";
import HygieneStoryPage from "./pages/HygieneStoryPage";
import ExercisePage from "./pages/ExercisePage";
import { createUser, getProgress } from "./services/api";
import { Loader2 } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [usernameInput, setUsernameInput] = useState("test_user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-login default user on mount
  useEffect(() => {
    handleLogin("test_user");
  }, []);

  const handleLogin = async (username) => {
    setLoading(true);
    setError("");
    try {
      const userData = await createUser(username);
      setUser(userData);
      await fetchProgress(userData.id);
    } catch (err) {
      setError(
        "Failed to connect to the server. Please make sure the backend is running.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (userId) => {
    try {
      const progressData = await getProgress(userId);
      setProgress(progressData);
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  const handleRefreshProgress = () => {
    if (user) {
      fetchProgress(user.id);
    }
  };

  const handleResetUser = () => {
    setUser(null);
    setProgress(null);
    setCurrentModule(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F2FE] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-lg font-bold text-primary">Loading HealthQuest...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-sky-100 max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl mx-auto sticker-badge -rotate-3">
            HQ
          </div>
          <h2 className="text-3xl font-black text-primary">
            Welcome to HealthQuest!
          </h2>
          <p className="text-slate-600 font-medium">
            Enter your explorer name to start learning healthy habits and
            earning badges!
          </p>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 p-3 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (usernameInput.trim()) {
                handleLogin(usernameInput.trim());
              }
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-left text-sm font-bold text-slate-700 mb-1"
              >
                Explorer Name
              </label>
              <input
                id="username"
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. SuperBunny"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none font-bold text-lg"
              />
              <p className="text-xs text-slate-500 text-left mt-1">
                Default test account:{" "}
                <span className="font-bold">test_user</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-white font-bold py-4 rounded-xl chunky-button"
            >
              Let's Go! 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  switch (currentModule) {
    case "nutrition":
      return (
        <NutritionGamePage
          user={user}
          progress={progress}
          onBack={() => setCurrentModule(null)}
          onRefreshProgress={handleRefreshProgress}
        />
      );
    case "hygiene":
      return (
        <HygieneStoryPage
          user={user}
          progress={progress}
          onBack={() => setCurrentModule(null)}
          onRefreshProgress={handleRefreshProgress}
        />
      );
    case "exercise":
      return (
        <ExercisePage
          user={user}
          progress={progress}
          onBack={() => setCurrentModule(null)}
          onRefreshProgress={handleRefreshProgress}
        />
      );
    default:
      return (
        <DashboardPage
          user={user}
          progress={progress}
          onSelectModule={setCurrentModule}
          onResetUser={handleResetUser}
        />
      );
  }
}
