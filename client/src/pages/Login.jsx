import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Lock, Mail, AlertCircle } from "lucide-react";
import { authService } from "../services/api";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      const user = await authService.getMe();
      onLoginSuccess(user);
      if (user.role === "librarian") {
        navigate("/dashboard");
      } else {
        navigate("/portal");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100">
            Welcome to LibMax
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your library account
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              to="/password-reset"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-950/50 border border-slate-800/50 rounded-xl text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            💡 Test Accounts Available:
          </p>
          <p>
            • Librarian:{" "}
            <span className="text-emerald-400">librarian@example.com</span> /{" "}
            <span className="text-emerald-400">testpassword</span>
          </p>
          <p>
            • Member: <span className="text-emerald-400">test@example.com</span>{" "}
            / <span className="text-emerald-400">testpassword</span>
          </p>
        </div>
      </div>
    </div>
  );
}
