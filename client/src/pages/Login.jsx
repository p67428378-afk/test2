import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  UserPlus,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { authService } from "../services/api";

export default function Login({ initialTab = "signin", onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("test@example.com");
  const [signInPassword, setSignInPassword] = useState("testpassword");

  // Sign Up state
  const [signUpFullName, setSignUpFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  // Feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isMinLength = signUpPassword.length >= 8;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authService.login(signInEmail, signInPassword);
      let userData = null;
      try {
        userData = await authService.getMe();
      } catch (err) {
        userData = { email: signInEmail, role: "member" };
      }
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isMinLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await authService.signup(signUpEmail, signUpPassword, signUpFullName);
      setSuccess(
        "Account created successfully! Please sign in with your credentials.",
      );
      setSignInEmail(signUpEmail);
      setSignInPassword("");
      setSignUpFullName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setActiveTab("signin");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Email address may already be registered.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="max-w-md w-full space-y-6 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            {activeTab === "signin" ? (
              <BookOpen className="h-8 w-8" />
            ) : (
              <UserPlus className="h-8 w-8" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-slate-100">
            {activeTab === "signin"
              ? "Welcome to KeyCraft"
              : "Create an Account"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {activeTab === "signin"
              ? "Sign in to manage your account and secure session vault"
              : "Self-register to access secure key generation and session vault"}
          </p>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-slate-800">
          <button
            type="button"
            onClick={() => handleTabChange("signin")}
            className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
              activeTab === "signin"
                ? "text-emerald-400 border-b-2 border-emerald-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("signup")}
            className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
              activeTab === "signup"
                ? "text-emerald-400 border-b-2 border-emerald-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Notification Banners */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === "signin" && (
          <form className="space-y-4" onSubmit={handleSignIn}>
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
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="test@example.com"
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
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <Link
                to="/password-reset"
                className="text-emerald-400 hover:text-emerald-300 transition-colors text-xs"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === "signup" && (
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={signUpFullName}
                    onChange={(e) => setSignUpFullName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="newuser@example.com"
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
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
              <p className="text-slate-400 font-medium mb-1">
                Password Requirements:
              </p>
              <div
                className={`flex items-center gap-2 ${
                  isMinLength ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                <span>{isMinLength ? "✓" : "○"}</span>
                <span>Minimum 8 characters</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span>✓</span>
                <span>Hashed with passlib/bcrypt</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Test Accounts Box */}
        <div className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-xl text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            💡 Test Accounts Available:
          </p>
          <p>
            • Member: <span className="text-emerald-400">test@example.com</span>{" "}
            / <span className="text-emerald-400">testpassword</span>
          </p>
          <p>
            • Librarian:{" "}
            <span className="text-emerald-400">librarian@example.com</span> /{" "}
            <span className="text-emerald-400">testpassword</span>
          </p>
        </div>
      </div>
    </div>
  );
}
