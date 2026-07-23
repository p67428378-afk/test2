import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout.jsx";
import WorklistPage from "./pages/WorklistPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { authService } from "./services/api.js";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [activeTab, setActiveTab] = useState("worklist");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("test@example.com"); // Pre-filled test credentials
  const [password, setPassword] = useState("testpassword"); // Pre-filled test credentials
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.login(email, password);
      setIsAuthenticated(true);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid email or password. Success UI must be gated on a real 2xx response.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-outline-variant p-space-lg shadow-sm space-y-6">
          <div className="text-center">
            <h1 className="font-headline-md text-headline-md font-bold text-primary">
              BFSI Worklist
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Institutional Portal Login
            </p>
          </div>

          {error && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl border border-error/20 flex items-center gap-3">
              <span
                className="material-symbols-outlined text-error"
                data-icon="error"
              >
                error
              </span>
              <span className="text-body-md font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant text-center space-y-1">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Test Credentials
            </p>
            <p className="text-sm text-on-surface font-medium">
              Email: <span className="font-bold">test@example.com</span>
            </p>
            <p className="text-sm text-on-surface font-medium">
              Password: <span className="font-bold">testpassword</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onLogout={handleLogout}
    >
      {activeTab === "worklist" && <WorklistPage searchQuery={searchQuery} />}
      {activeTab === "analytics" && (
        <div className="bg-white rounded-xl border border-outline-variant p-space-lg shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
            Analytics Dashboard
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Detailed operational analytics and performance metrics will appear
            here.
          </p>
        </div>
      )}
      {activeTab === "settings" && <SettingsPage />}
    </AppLayout>
  );
}
