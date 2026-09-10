import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  User,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function AuthCard() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register({ email, password, full_name: fullName });
      } else {
        await login(email, password, rememberMe);
      }
      navigate("/builder");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.message ||
        "Authentication failed. Please verify credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillTestAccount = () => {
    setIsRegister(false);
    setEmail("test@example.com");
    setPassword("testpassword");
  };

  return (
    <div className="max-w-md w-full mx-auto my-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white text-center">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Quick CV Authentication</h1>
        <p className="text-xs text-indigo-100 mt-1">
          {isRegister
            ? "Create an account to start crafting your professional resume"
            : "Sign in to access your resumes and export PDF CVs"}
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 mb-6" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
            className={`flex-1 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 transition ${
              !isRegister
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
            className={`flex-1 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 transition ${
              isRegister
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2.5 mb-5 text-sm"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block">
                Authentication Error
              </strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label
                htmlFor="auth_full_name"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="auth_full_name"
                  type="text"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth_email"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth_email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth_password"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="auth_password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {!isRegister && (
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="auth_remember_me"
                className="flex items-center text-xs text-slate-600 cursor-pointer"
              >
                <input
                  id="auth_remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-2 h-4 w-4"
                />
                Remember me
              </label>
              <span className="text-xs text-indigo-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Quick CV</span>
              </>
            )}
          </button>
        </form>

        {/* Test account callout */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Test Account Credentials
            </span>
            <button
              type="button"
              onClick={handleFillTestAccount}
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 underline"
            >
              Autofill
            </button>
          </div>
          <p>
            • Email:{" "}
            <code className="text-indigo-700 font-mono bg-indigo-50 px-1 py-0.5 rounded">
              test@example.com
            </code>
          </p>
          <p>
            • Password:{" "}
            <code className="text-indigo-700 font-mono bg-indigo-50 px-1 py-0.5 rounded">
              testpassword
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
