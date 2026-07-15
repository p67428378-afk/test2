import React, { useState } from "react";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { authService } from "../services/api";

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin }) {
  const [email, setEmail] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !masterPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (masterPassword.length < 8) {
      setError("Master password must be at least 8 characters long.");
      return;
    }

    if (masterPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.register(email, masterPassword);
      setSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
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
            Create Master Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Set up your secure master password. This password is used to encrypt
            your vault and cannot be recovered if lost.
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm flex flex-col items-center gap-2 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mb-1" />
            <span className="font-semibold">Account Created Successfully!</span>
            <span>Redirecting you to login...</span>
          </div>
        ) : (
          <>
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
                    Master Password (min 8 chars)
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Confirm Master Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </>
        )}

        <div className="text-center pt-4 border-t border-slate-800/60">
          <p className="text-sm text-slate-400">
            Already have a master account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
