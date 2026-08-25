import React, { useState } from "react";
import { CheckSquare } from "lucide-react";

export default function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        await onAuthSuccess("login", { email, password });
      } else {
        await onAuthSuccess("signup", { email, password });
        setSuccess("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Authentication failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7fafc]">
      {/* Left Side: Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2663eb] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2663eb] to-[#4f46e5] opacity-90" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-8 w-8" />
            <span className="font-bold text-2xl tracking-tight">TaskFlow</span>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Organize your daily workload, set deadlines, and track your
            productivity in real-time.
          </h1>
          <p className="text-lg text-white/80">
            Join thousands of users who have boosted their productivity by over
            35% using TaskFlow.
          </p>
        </div>
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
              Productivity Boost
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">+35%</span>
              <span className="text-sm text-white/80">
                Average user improvement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-[#e3e8f0] shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#171c29]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-sm text-[#707a8c]">
              {isLogin
                ? "Log in to manage your daily tasks"
                : "Sign up to start organizing your workload"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e3e8f0]">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                isLogin
                  ? "border-[#2663eb] text-[#2663eb]"
                  : "border-transparent text-[#707a8c] hover:text-[#171c29]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                !isLogin
                  ? "border-[#2663eb] text-[#2663eb]"
                  : "border-transparent text-[#707a8c] hover:text-[#171c29]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 bg-[#db2626]/10 border border-[#db2626]/20 text-[#db2626] text-sm rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-[#17a34a]/10 border border-[#17a34a]/20 text-[#17a34a] text-sm rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb] transition-colors"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2663eb] hover:bg-[#2663eb]/90 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : isLogin ? "Log In" : "Register"}
            </button>
          </form>

          {/* Test Credentials Note */}
          {isLogin && (
            <div className="p-4 bg-[#f7fafc] border border-[#e3e8f0] rounded-xl text-xs text-[#707a8c] space-y-1">
              <p className="font-semibold text-[#171c29]">
                Test Account Credentials:
              </p>
              <p>
                Email:{" "}
                <span className="font-mono text-[#2663eb]">
                  test@example.com
                </span>
              </p>
              <p>
                Password:{" "}
                <span className="font-mono text-[#2663eb]">testpassword</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
