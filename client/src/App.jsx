import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import SolarOwnerDashboard from "./pages/SolarOwnerDashboard.jsx";
import TechnicianDashboard from "./pages/TechnicianDashboard.jsx";
import { authService, alertService } from "./services/api.js";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const profile = await authService.getMe();
      setUser(profile);
      setRole(profile.role);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      handleLogout();
    }
  };

  const fetchAlertCount = async () => {
    if (role === "owner") {
      try {
        const alerts = await alertService.getAlerts();
        const active = alerts.filter((a) => !a.is_resolved);
        setAlertCount(active.length);
      } catch (err) {
        console.error("Failed to fetch alerts count:", err);
      }
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchUserProfile().finally(() => setLoading(false));
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchAlertCount();
      // Refresh alert count periodically
      const interval = setInterval(fetchAlertCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, role]);

  const handleLoginSuccess = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.access_token);
    setRole(data.role);
  };

  const handleLogout = () => {
    authService.logout();
    setToken(null);
    setRole(null);
    setUser(null);
    setActiveTab("dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p className="text-slate-400 text-sm font-medium">
          Authenticating session...
        </p>
      </div>
    );
  }

  if (!token) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppLayout
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      alertCount={alertCount}
    >
      {role === "technician" ? (
        <TechnicianDashboard />
      ) : (
        <SolarOwnerDashboard
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </AppLayout>
  );
}
