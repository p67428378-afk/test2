import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { authService } from "./services/api";
import AppLayout from "./components/layout/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ReportItemPage from "./pages/ReportItemPage.jsx";
import BrowseFoundPage from "./pages/BrowseFoundPage.jsx";
import AdminClaimsPage from "./pages/AdminClaimsPage.jsx";
import Button from "./components/common/Button.jsx";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login({ username: email, password });
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E293B] px-4">
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to ReclaimAI Lost & Found
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-indigo-400">
            Test Accounts Available:
          </p>
          <p>
            • User: <span className="text-white">test@example.com</span> /{" "}
            <span className="text-white">testpassword</span>
          </p>
          <p>
            • Admin: <span className="text-white">admin@example.com</span> /{" "}
            <span className="text-white">adminpassword</span>
          </p>
        </div>

        <div className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#6366F1] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.register({
        email,
        full_name: fullName,
        password,
        role,
      });
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E293B] px-4">
        <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-xl p-8 shadow-2xl text-center space-y-4">
          <h2 className="text-2xl font-bold text-emerald-400">
            Registration Successful!
          </h2>
          <p className="text-sm text-slate-400">
            You can now log in with your credentials.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[#6366F1] text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E293B] px-4">
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-slate-400 mt-1">
            Join ReclaimAI Lost & Found
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#1E293B] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-[#1E293B] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1E293B] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6366F1] hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/report" element={<ReportItemPage />} />
                  <Route path="/browse" element={<BrowseFoundPage />} />
                  <Route path="/admin" element={<AdminClaimsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
