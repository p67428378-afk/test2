import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ComponentsPage from "./pages/ComponentsPage.jsx";
import MissionsPage from "./pages/MissionsPage.jsx";
import { authService } from "./services/api";
import { KeyRound } from "lucide-react";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1413] flex items-center justify-center p-4">
      <div className="bg-[#1b2120] border border-[#3d4947] rounded-xl max-w-md w-full p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#6bd8cb]/10 rounded-full text-[#6bd8cb]">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#dee4e1]">
            AstroTrack Login
          </h2>
          <p className="text-sm text-[#bcc9c6]">
            Access the Mission Control Equipment Tracking System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#29a195] hover:bg-[#6bd8cb] text-[#00302b] font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="p-4 bg-[#171d1c] border border-[#3d4947] rounded-lg text-xs text-[#bcc9c6] space-y-1">
          <div className="font-semibold text-[#dee4e1]">Test Credentials:</div>
          <div>
            Email:{" "}
            <span className="font-mono text-[#6bd8cb]">test@example.com</span>
          </div>
          <div>
            Password:{" "}
            <span className="font-mono text-[#6bd8cb]">testpassword</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!authService.getCurrentUser(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <AppLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        alertCount={3}
        onAlertsClick={() => alert("Alerts check triggered!")}
        onNewMissionClick={() => alert("New Mission creation triggered!")}
      >
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/maintenance" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
