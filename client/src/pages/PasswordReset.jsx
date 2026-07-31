import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Key,
  Phone,
  ShieldQuestion,
  Lock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { passwordResetService } from "../services/api";

export default function PasswordReset() {
  const [step, setStep] = useState(1); // 1: Initiate, 2: OTP, 3: Security Question, 4: New Password, 5: Success
  const [loginId, setLoginId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityQuestionSessionId, setSecurityQuestionSessionId] =
    useState("");
  const [answer, setAnswer] = useState("");
  const [passwordResetSessionId, setPasswordResetSessionId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInitiate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await passwordResetService.initiate(loginId, mobileNumber);
      setOtpSessionId(data.otp_session_id);
      setSecurityQuestion(data.security_question);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to initiate password reset. Please check your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await passwordResetService.verifyOTP(otpCode, otpSessionId);
      setSecurityQuestionSessionId(data.security_question_session_id);
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid OTP code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurityQuestion = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await passwordResetService.verifySecurityQuestion(
        answer,
        securityQuestionSessionId,
      );
      setPasswordResetSessionId(data.password_reset_session_id);
      setStep(4);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Incorrect answer. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await passwordResetService.setNewPassword(
        newPassword,
        passwordResetSessionId,
      );
      setStep(5);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to set new password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-400">
            Follow the steps to recover your account
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleInitiate} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email / Login ID
                </label>
                <input
                  type="email"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                  placeholder="librarian@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg transition-colors text-sm"
            >
              {loading ? "Initiating..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Enter OTP Code
              </label>
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm text-center tracking-widest font-bold"
                placeholder="123456"
              />
              <p className="mt-2 text-xs text-slate-400 text-center">
                For testing, use OTP code:{" "}
                <span className="text-emerald-400 font-semibold">123456</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg transition-colors text-sm"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleVerifySecurityQuestion} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Security Question
              </label>
              <p className="text-sm text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4">
                {securityQuestion}
              </p>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Your Answer
              </label>
              <input
                type="text"
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                placeholder="Your answer"
              />
              <p className="mt-2 text-xs text-slate-400">
                For testing, use answer:{" "}
                <span className="text-emerald-400 font-semibold">Reading</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg transition-colors text-sm"
            >
              {loading ? "Verifying..." : "Verify Answer"}
            </button>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleSetNewPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-semibold rounded-lg transition-colors text-sm"
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        )}

        {step === 5 && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              Password Reset Successful!
            </h3>
            <p className="text-sm text-slate-400">
              Your password has been updated successfully. You can now sign in
              with your new password.
            </p>
            <Link
              to="/login"
              className="block w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition-colors text-sm text-center"
            >
              Back to Login
            </Link>
          </div>
        )}

        {step < 5 && (
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
