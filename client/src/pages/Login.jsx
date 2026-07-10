import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";
import {
  Shield,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Reset Flow State
  const [resetStep, setResetStep] = useState(0); // 0 = none, 1 = email, 2 = otp, 3 = security question, 4 = new password
  const [resetEmail, setResetEmail] = useState("");
  const [resetSessionId, setResetSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login(usernameOrEmail, password);
      if (data.role === "visitor") {
        navigate("/visitor-dashboard");
      } else if (data.role === "staff") {
        navigate("/admin-dashboard");
      } else if (data.role === "security") {
        navigate("/security-console");
      } else {
        navigate("/visitor-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.initiatePasswordReset(resetEmail);
      setResetSessionId(data.password_reset_session_id);
      setResetStep(2); // Move to OTP verification
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to initiate password reset.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.verifyOtp(otp, resetSessionId);
      setResetSessionId(data.security_question_session_id);
      setSecurityQuestion(data.security_question);
      setResetStep(3); // Move to Security Question
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurityQuestion = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.verifySecurityQuestion(
        securityAnswer,
        resetSessionId,
      );
      setResetSessionId(data.password_reset_session_id);
      setResetStep(4); // Move to Set New Password
    } catch (err) {
      setError(err.response?.data?.detail || "Incorrect answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.setNewPassword(newPassword, resetSessionId);
      setResetSuccess("Password reset successfully! You can now log in.");
      setResetStep(0);
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to set new password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {resetStep === 0 ? "Sign in to PVMS" : "Reset Password"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {resetStep === 0
              ? "Prison Visitor Management System"
              : `Step ${resetStep} of 4`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start space-x-3 text-sm">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-start space-x-3 text-sm">
            <AlertCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {resetStep === 0 && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="test@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setResetStep(1)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </button>
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register as Visitor
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Test Accounts:</p>
              <p>
                • Visitor:{" "}
                <code className="bg-slate-200 px-1 rounded">
                  test@example.com
                </code>{" "}
                /{" "}
                <code className="bg-slate-200 px-1 rounded">testpassword</code>
              </p>
              <p>
                • Staff:{" "}
                <code className="bg-slate-200 px-1 rounded">staff</code> /{" "}
                <code className="bg-slate-200 px-1 rounded">testpassword</code>
              </p>
              <p>
                • Security:{" "}
                <code className="bg-slate-200 px-1 rounded">security</code> /{" "}
                <code className="bg-slate-200 px-1 rounded">testpassword</code>
              </p>
            </div>
          </form>
        )}

        {resetStep === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleInitiateReset}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Enter your Email
              </label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="visitor@example.com"
              />
            </div>
            <div className="flex items-center justify-between space-x-4">
              <button
                type="button"
                onClick={() => setResetStep(0)}
                className="w-1/2 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>
        )}

        {resetStep === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="123456"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {resetStep === 3 && (
          <form
            className="mt-8 space-y-6"
            onSubmit={handleVerifySecurityQuestion}
          >
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 mb-4">
              <p className="font-semibold text-slate-800 mb-1">
                Security Question:
              </p>
              <p>{securityQuestion}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your Answer
              </label>
              <input
                type="text"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Answer"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Answer"}
            </button>
          </form>
        )}

        {resetStep === 4 && (
          <form className="mt-8 space-y-6" onSubmit={handleSetNewPassword}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
