import React, { useState } from "react";
import { authService } from "./services/api";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import { KeyRound, Mail, AlertCircle, CheckCircle } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Login Form State
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loginError, setLoginError] = useState("");

  // Password Reset State
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Initiate, 2: OTP, 3: Security Question, 4: New Password
  const [resetLoginId, setResetLoginId] = useState("");
  const [resetMobile, setResetMobile] = useState("");
  const [resetOtp, setResetOTP] = useState("");
  const [resetAnswer, setResetAnswer] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityQuestionSessionId, setSecurityQuestionSessionId] =
    useState("");
  const [passwordResetSessionId, setPasswordResetSessionId] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await authService.login(email, password);
      setIsAuthenticated(true);
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError(
        err.response?.data?.detail || "Invalid credentials provided.",
      );
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setSelectedBookingId(null);
  };

  // Password Reset Handlers
  const handleResetInitiate = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await authService.initiatePasswordReset(
        resetLoginId,
        resetMobile,
      );
      setOtpSessionId(res.otp_session_id);
      setSecurityQuestion(res.security_question);
      setResetStep(2);
    } catch (err) {
      setLoginError(
        err.response?.data?.detail || "Failed to initiate password reset.",
      );
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await authService.verifyOTP(resetOtp, otpSessionId);
      setSecurityQuestionSessionId(res.security_question_session_id);
      setResetStep(3);
    } catch (err) {
      setLoginError(err.response?.data?.detail || "Invalid OTP code.");
    }
  };

  const handleVerifySecurityQuestion = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await authService.verifySecurityQuestion(
        resetAnswer,
        securityQuestionSessionId,
      );
      setPasswordResetSessionId(res.password_reset_session_id);
      setResetStep(4);
    } catch (err) {
      setLoginError(err.response?.data?.detail || "Incorrect answer.");
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await authService.setNewPassword(
        resetNewPassword,
        passwordResetSessionId,
      );
      setResetSuccessMsg(res.status || "Password reset successful!");
      setTimeout(() => {
        setShowReset(false);
        setResetStep(1);
        setResetSuccessMsg("");
      }, 3000);
    } catch (err) {
      setLoginError(
        err.response?.data?.detail || "Failed to set new password.",
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e1511] px-4">
        <div className="max-w-md w-full space-y-8 bg-surface-container p-8 border border-outline-variant rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/30 mb-4">
              <span className="text-primary font-bold text-2xl">S</span>
            </div>
            <h2 className="text-3xl font-extrabold text-on-surface">
              Summit Logistics
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              TrekGuide Portal Mission Control
            </p>
          </div>

          {loginError && (
            <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {resetSuccessMsg && (
            <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{resetSuccessMsg}</span>
            </div>
          )}

          {!showReset ? (
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-10 py-2.5 bg-surface-container-lowest border border-outline-variant placeholder-outline text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="guide@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-10 py-2.5 bg-surface-container-lowest border border-outline-variant placeholder-outline text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-xs text-outline">
                  Test account: test@example.com / testpassword
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowReset(true);
                    setResetStep(1);
                    setLoginError("");
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-on-primary-container bg-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                >
                  Sign In
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold text-on-surface">
                Reset Password
              </h3>

              {resetStep === 1 && (
                <form onSubmit={handleResetInitiate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                      Login ID (Email)
                    </label>
                    <input
                      type="text"
                      required
                      value={resetLoginId}
                      onChange={(e) => setResetLoginId(e.target.value)}
                      className="rounded-lg block w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="guide@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={resetMobile}
                      onChange={(e) => setResetMobile(e.target.value)}
                      className="rounded-lg block w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="+1234567890"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary text-on-primary-container font-semibold rounded-lg hover:brightness-110 transition-all text-sm"
                  >
                    Initiate Reset
                  </button>
                </form>
              )}

              {resetStep === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <p className="text-xs text-on-surface-variant">
                    An OTP has been sent to your mobile. Enter it below.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={resetOtp}
                      onChange={(e) => setResetOTP(e.target.value)}
                      className="rounded-lg block w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="123456"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary text-on-primary-container font-semibold rounded-lg hover:brightness-110 transition-all text-sm"
                  >
                    Verify OTP
                  </button>
                </form>
              )}

              {resetStep === 3 && (
                <form
                  onSubmit={handleVerifySecurityQuestion}
                  className="space-y-4"
                >
                  <p className="text-sm text-primary font-medium">
                    {securityQuestion}
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                      Your Answer
                    </label>
                    <input
                      type="text"
                      required
                      value={resetAnswer}
                      onChange={(e) => setResetAnswer(e.target.value)}
                      className="rounded-lg block w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Answer"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary text-on-primary-container font-semibold rounded-lg hover:brightness-110 transition-all text-sm"
                  >
                    Verify Answer
                  </button>
                </form>
              )}

              {resetStep === 4 && (
                <form onSubmit={handleSetNewPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      className="rounded-lg block w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-primary text-on-primary-container font-semibold rounded-lg hover:brightness-110 transition-all text-sm"
                  >
                    Set New Password
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setResetStep(1);
                  setLoginError("");
                }}
                className="w-full text-center text-xs text-outline hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1511] text-[#dde4dd]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedBookingId(null);
        }}
        onLogout={handleLogout}
      />

      <main className="ml-[260px] pt-[64px] p-8 max-w-[1600px]">
        {selectedBookingId ? (
          <BookingDetailPage
            bookingId={selectedBookingId}
            onBack={() => setSelectedBookingId(null)}
          />
        ) : activeTab === "dashboard" ? (
          <DashboardPage onSelectBooking={(id) => setSelectedBookingId(id)} />
        ) : activeTab === "availability" ? (
          <AvailabilityPage />
        ) : (
          <DashboardPage onSelectBooking={(id) => setSelectedBookingId(id)} />
        )}
      </main>
    </div>
  );
}
