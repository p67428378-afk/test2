import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Lock, Mail, AlertCircle, Info } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const loggedUser = await login({ email, password });
      if (loggedUser.role === "faculty") {
        navigate("/faculty/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Invalid email or password. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-950 text-amber-400 rounded-xl shadow-md mb-2">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Sign in to LMS Portal
          </h1>
          <p className="text-xs text-slate-500">
            Welcome back! Please enter your academic credentials.
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-950 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Test Account Details:</p>
            <p className="mt-0.5">
              Student:{" "}
              <code className="font-semibold text-indigo-900">
                test@example.com
              </code>{" "}
              /{" "}
              <code className="font-semibold text-indigo-900">
                testpassword
              </code>
            </p>
            <p>
              Faculty:{" "}
              <code className="font-semibold text-indigo-900">
                admin@example.com
              </code>{" "}
              /{" "}
              <code className="font-semibold text-indigo-900">
                adminpassword
              </code>
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@college.edu"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-950 text-white font-bold rounded-lg shadow hover:bg-indigo-900 transition text-sm disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-indigo-900 hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
