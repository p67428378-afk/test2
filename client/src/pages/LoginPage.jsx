import React, { useState } from "react";
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { authService } from "../services/api";

export default function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState("test@example.com");
  const [masterPassword, setMasterPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !masterPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.login(email, masterPassword);
      onLoginSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid email or master password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-slate-900/50 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-sm relative z-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to Fortress
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your master account to unlock your vault.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-colors"
          >
            {loading ? "Unlocking Vault..." : "Unlock Vault"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800/60">
          <p className="text-sm text-slate-400">
            Don't have a master account?{" "}
            <button
              onClick={onNavigateToRegister}
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create one now
            </button>
          </p>
        </div>

        {/* Test Credentials Note */}
        <div className="mt-6 p-3.5 bg-slate-950/60 border border-slate-800/60 rounded-lg text-xs text-slate-400 text-center">
          <p className="font-semibold text-slate-300 mb-1">
            💡 Quick Test Account
          </p>
          <p>
            Email:{" "}
            <code className="text-blue-400 font-mono">test@example.com</code>
          </p>
          <p>
            Password:{" "}
            <code className="text-blue-400 font-mono">testpassword</code>
          </p>
        </div>
      </div>
    </div>
  );
}
