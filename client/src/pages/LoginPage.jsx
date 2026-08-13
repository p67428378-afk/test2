import React, { useState } from "react";
import { Radio, Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { loginUser } from "../services/api";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        if (onLoginSuccess) onLoginSuccess(res);
      }
    } catch (err) {
      console.error("Login failed", err);
      const msg = err.response?.data?.detail || "Invalid email or password.";
      setError(typeof msg === "object" ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white mx-auto shadow-lg shadow-indigo-500/30">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            FestControl Operations
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access Multi-Stage Scheduling, Volunteer Roster, and QR
            Validation
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-300 font-medium text-xs mb-1.5">
              User Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium text-xs mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Test Credentials Seeded</span>
            </div>
            <p className="font-mono">Email: test@example.com</p>
            <p className="font-mono">Password: testpassword</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30"
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
