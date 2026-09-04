import React, { useState } from "react";
import { Lock, Mail, AlertCircle, X, ShieldCheck } from "lucide-react";
import { loginUser } from "../services/api";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("adminpassword");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        onLoginSuccess(data);
        onClose();
      } else {
        setError("Login failed. Token not received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const apiDetail = err.response?.data?.detail;
      const msg =
        typeof apiDetail === "string"
          ? apiDetail
          : "Invalid admin credentials or connection error.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Admin Authentication
            </h2>
            <p className="text-xs text-slate-400">
              Log in with an administrator account to view insights
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl mb-6 text-xs text-slate-300">
          <span className="font-semibold text-indigo-400 block mb-1">
            Test Credentials:
          </span>
          <div>
            Admin:{" "}
            <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">
              admin@example.com
            </code>{" "}
            /{" "}
            <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">
              adminpassword
            </code>
          </div>
          <div>
            User:{" "}
            <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">
              test@example.com
            </code>{" "}
            /{" "}
            <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">
              testpassword
            </code>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Log In to Admin Portal"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
