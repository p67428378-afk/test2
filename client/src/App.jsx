import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import PlotInventoryPage from "./pages/PlotInventoryPage.jsx";
import CreatePlotPage from "./pages/CreatePlotPage.jsx";
import { authService } from "./services/api";

function LoginPage() {
  const [username, setUsername] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login(username, password);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-xl border border-surface-variant soft-loom-shadow space-y-6">
        <div className="text-center space-y-2">
          <span
            className="material-symbols-outlined text-5xl text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            nature
          </span>
          <h2 className="text-2xl font-bold text-on-surface">
            EternalRest Admin
          </h2>
          <p className="text-outline text-sm">Cemetery Management System</p>
        </div>

        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2"
            >
              Username / Email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-outline uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="p-4 bg-surface-container-low rounded-lg border border-surface-variant text-xs text-outline space-y-1">
          <p className="font-semibold text-on-surface-variant">
            Test Accounts:
          </p>
          <p>
            User:{" "}
            <span className="font-mono text-primary">test@example.com</span> /{" "}
            <span className="font-mono text-primary">testpassword</span>
          </p>
          <p>
            Admin:{" "}
            <span className="font-mono text-primary">admin@example.com</span> /{" "}
            <span className="font-mono text-primary">adminpassword</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plots"
          element={
            <ProtectedRoute>
              <PlotInventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plots/create"
          element={
            <ProtectedRoute>
              <CreatePlotPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
