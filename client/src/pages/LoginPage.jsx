import React, { useState } from "react";
import { Sun, Lock, Mail, AlertCircle } from "lucide-react";
import Button from "../components/common/Button.jsx";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLoginSuccess(email, password);
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-md w-full bg-slate-850 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-sm bg-slate-950/80">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400 mb-4 animate-bounce">
            <Sun className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Helios Platform
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Solar Panel Monitoring & Maintenance
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 text-sm">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">Demo Credentials</p>
          <div className="mt-2 inline-block bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-left text-xs text-slate-400 font-mono">
            <div>
              Email: <span className="text-amber-400">test@example.com</span>
            </div>
            <div>
              Pass: <span className="text-amber-400">testpassword</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
