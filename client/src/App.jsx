import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import SchedulingPage from "./pages/SchedulingPage";
import VolunteersPage from "./pages/VolunteersPage";
import GateScannerPage from "./pages/GateScannerPage";
import LoginPage from "./pages/LoginPage";
import { getMe } from "./services/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }
    try {
      const user = await getMe();
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      localStorage.removeItem("token");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const handleLoginSuccess = () => {
    fetchUser();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">
        Initializing FestControl Platform...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-slate-950 min-w-0">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/scheduling" element={<SchedulingPage />} />
              <Route path="/volunteers" element={<VolunteersPage />} />
              <Route path="/gate-scanner" element={<GateScannerPage />} />
              <Route
                path="/login"
                element={
                  currentUser ? (
                    <Navigate to="/" replace />
                  ) : (
                    <LoginPage onLoginSuccess={handleLoginSuccess} />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
