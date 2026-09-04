import React, { useState, useEffect } from "react";
import AdminInsightsDashboard from "../components/AdminInsightsDashboard";
import LoginModal from "../components/LoginModal";

export default function AdminDashboardPage({ onNavigateHome }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setIsLoginOpen(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    onNavigateHome();
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">
            Admin Portal Authentication Required
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Please log in with administrator credentials to view the insights
            dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
            >
              Open Login
            </button>
            <button
              onClick={onNavigateHome}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700"
            >
              Return Home
            </button>
          </div>
        </div>
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <AdminInsightsDashboard
      onLogout={handleLogout}
      onNavigateHome={onNavigateHome}
    />
  );
}
