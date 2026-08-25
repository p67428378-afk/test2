import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { authService } from "./services/api";
import Navbar from "./components/Navbar";
import SearchView from "./pages/SearchView";
import DashboardView from "./pages/DashboardView";

// Simple Protected Route Component
function ProtectedRoute({ children, user, loading }) {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6173f5]"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Login View Component
function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      const user = await authService.getMe();
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] flex flex-col justify-center items-center p-6">
      <div className="bg-[#1f293b] border border-[#334054] p-8 rounded-[14px] w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#6173f5] mb-6">
          CineList Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#94a3b8]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#141c2b] border border-[#334054] p-3 rounded-[10px] text-white outline-none focus:border-[#6173f5]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#94a3b8]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#141c2b] border border-[#334054] p-3 rounded-[10px] text-white outline-none focus:border-[#6173f5]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#6173f5] hover:bg-[#4f5fd8] text-white font-medium p-3 rounded-[10px] transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#94a3b8]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#6173f5] hover:underline">
            Register here
          </Link>
        </div>

        {/* Test Credentials Note */}
        <div className="mt-6 p-4 bg-[#141c2b] border border-[#334054] rounded-[10px] text-xs text-[#94a3b8]">
          <p className="font-bold text-white mb-1">Test Account Credentials:</p>
          <p>
            Email:{" "}
            <span className="text-white font-mono">test@example.com</span>
          </p>
          <p>
            Password: <span className="text-white font-mono">testpassword</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Register View Component
function RegisterView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await authService.register(email, password);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Email may already be registered.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] flex flex-col justify-center items-center p-6">
      <div className="bg-[#1f293b] border border-[#334054] p-8 rounded-[14px] w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#6173f5] mb-6">
          CineList Register
        </h2>

        {success ? (
          <div className="text-center flex flex-col gap-4">
            <p className="text-green-400 font-medium">
              Registration successful!
            </p>
            <Link
              to="/login"
              className="bg-[#6173f5] hover:bg-[#4f5fd8] text-white font-medium p-3 rounded-[10px] transition-colors"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#94a3b8]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#141c2b] border border-[#334054] p-3 rounded-[10px] text-white outline-none focus:border-[#6173f5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#94a3b8]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#141c2b] border border-[#334054] p-3 rounded-[10px] text-white outline-none focus:border-[#6173f5]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#6173f5] hover:bg-[#4f5fd8] text-white font-medium p-3 rounded-[10px] transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-[#94a3b8]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6173f5] hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0f1729] text-[#f7fafc] flex flex-col">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginView onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <RegisterView />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <SearchView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <DashboardView />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
