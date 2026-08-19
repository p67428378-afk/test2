import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import DashboardPage from "./pages/DashboardPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import CostsPage from "./pages/CostsPage";
import MembersPage from "./pages/MembersPage";
import LoginPage from "./pages/LoginPage";
import { authAPI } from "./services/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authAPI.getMe();
        setCurrentUser(user);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#2663eb] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#707a8c]">
            Loading HomeKeep...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7fafc] text-[#171c29] flex flex-col font-sans">
        <Navbar
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/costs" element={<CostsPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={(u) => setCurrentUser(u)} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
