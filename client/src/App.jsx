import React, { useState, useEffect } from "react";
import { authService } from "./services/api";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import TeamCalendar from "./pages/TeamCalendar";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("my-leave"); // 'my-leave', 'team-leave', 'team-calendar'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab("my-leave");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <p className="text-body-lg font-body-lg text-secondary">
          Loading HR Portal...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="text-on-background bg-[#F8FAFC] min-h-screen flex overflow-hidden">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-full bg-on-secondary-fixed dark:bg-on-secondary-fixed w-[280px] fixed left-0 top-0 py-margin-page z-20">
        <div className="px-margin-page mb-8 flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white flex items-center justify-center text-primary font-bold text-lg">
            H
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary-fixed">
              HR Portal
            </h1>
            <p className="text-label-sm font-label-sm text-secondary-fixed-dim">
              Leave Management
            </p>
          </div>
        </div>
        <ul className="flex flex-col flex-1 mt-4">
          {/* My Leave Tab */}
          <li className="px-4 py-2">
            <button
              onClick={() => setActiveTab("my-leave")}
              className={`w-full flex items-center gap-wide px-margin-page py-3 rounded-lg border-l-4 transition-all duration-200 ${
                activeTab === "my-leave"
                  ? "text-primary-fixed bg-on-secondary-fixed-variant border-primary-container"
                  : "text-secondary-fixed-dim hover:bg-on-secondary-fixed-variant hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined fill">
                calendar_today
              </span>
              <span className="text-body-md font-body-md font-semibold">
                My Leave
              </span>
            </button>
          </li>

          {/* Team Leave Tab (Manager Only) */}
          <li className="px-4 py-2">
            {user.role === "manager" ? (
              <button
                onClick={() => setActiveTab("team-leave")}
                className={`w-full flex items-center gap-wide px-margin-page py-3 rounded-lg border-l-4 transition-all duration-200 ${
                  activeTab === "team-leave"
                    ? "text-primary-fixed bg-on-secondary-fixed-variant border-primary-container"
                    : "text-secondary-fixed-dim hover:bg-on-secondary-fixed-variant hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">groups</span>
                <span className="text-body-md font-body-md font-semibold">
                  Team Leave
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between px-margin-page py-3 text-secondary-fixed-dim rounded-lg opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-wide">
                  <span className="material-symbols-outlined">groups</span>
                  <span className="text-body-md font-body-md">Team Leave</span>
                </div>
                <span className="material-symbols-outlined text-sm">lock</span>
              </div>
            )}
          </li>

          {/* Team Calendar Tab (Manager Only) */}
          <li className="px-4 py-2">
            {user.role === "manager" ? (
              <button
                onClick={() => setActiveTab("team-calendar")}
                className={`w-full flex items-center gap-wide px-margin-page py-3 rounded-lg border-l-4 transition-all duration-200 ${
                  activeTab === "team-calendar"
                    ? "text-primary-fixed bg-on-secondary-fixed-variant border-primary-container"
                    : "text-secondary-fixed-dim hover:bg-on-secondary-fixed-variant hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">
                  calendar_month
                </span>
                <span className="text-body-md font-body-md font-semibold">
                  Team Calendar
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between px-margin-page py-3 text-secondary-fixed-dim rounded-lg opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-wide">
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>
                  <span className="text-body-md font-body-md">
                    Team Calendar
                  </span>
                </div>
                <span className="material-symbols-outlined text-sm">lock</span>
              </div>
            )}
          </li>
        </ul>
        <div className="mt-auto px-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-on-secondary-fixed-variant/50">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-body-md font-body-md text-white font-semibold">
                {user.name}
              </p>
              <p className="text-label-sm font-label-sm text-secondary-fixed-dim capitalize">
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-wide px-margin-page py-3 text-secondary-fixed-dim hover:text-white transition-colors cursor-pointer mt-4"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-body-md font-body-md">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-[280px] h-screen overflow-y-auto">
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest dark:bg-surface-dim shadow-sm flex justify-between items-center h-16 px-margin-page sticky top-0 z-10">
          <h2 className="text-headline-md font-headline-md font-bold text-on-surface tracking-tight">
            {activeTab === "my-leave" && "My Leave Dashboard"}
            {activeTab === "team-leave" && "Team Leave Requests"}
            {activeTab === "team-calendar" && "Team Calendar"}
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white font-bold ring-2 ring-surface-container-high">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "my-leave" && <EmployeeDashboard />}
          {activeTab === "team-leave" && <ManagerDashboard />}
          {activeTab === "team-calendar" && <TeamCalendar />}
        </main>
      </div>
    </div>
  );
}
