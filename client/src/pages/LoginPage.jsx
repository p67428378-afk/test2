import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/common/Header";
import { LogIn, Compass, AlertCircle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await login({ email, password });
      if (user) {
        if (user.role === "Administrator") {
          navigate("/admin/schedules");
        } else if (user.role === "Guide") {
          navigate("/guide/attendance");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      // Do NOT clear user input on error!
      const detail = err.response?.data?.detail || "Invalid email or password.";
      setError(detail);
    }
  };

  const setTestRole = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
            <p className="text-xs text-slate-500 mt-1">
              Access Museum Tour Management System
            </p>
          </div>

          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Test Accounts Pre-configured:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setTestRole("test@example.com", "testpassword")}
                className="bg-white hover:bg-slate-100 border border-slate-200 p-1.5 rounded text-center text-slate-700 font-medium transition-colors"
              >
                Visitor
              </button>
              <button
                type="button"
                onClick={() =>
                  setTestRole("guide@example.com", "guidepassword")
                }
                className="bg-white hover:bg-slate-100 border border-slate-200 p-1.5 rounded text-center text-slate-700 font-medium transition-colors"
              >
                Guide
              </button>
              <button
                type="button"
                onClick={() =>
                  setTestRole("admin@example.com", "adminpassword")
                }
                className="bg-white hover:bg-slate-100 border border-slate-200 p-1.5 rounded text-center text-slate-700 font-medium transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
