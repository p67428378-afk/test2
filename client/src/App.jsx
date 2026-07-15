import React, { useState, useEffect } from "react";
import TopNavBar from "./components/layout/TopNavBar";
import ClientPortalPage from "./pages/ClientPortalPage";
import BrokerDashboardPage from "./pages/BrokerDashboardPage";
import { authService } from "./services/api";

export default function App() {
  const [currentView, setCurrentView] = useState("client"); // 'client', 'dashboard', 'login', 'register', 'forgot-password'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Password Reset Flow State
  const [resetStep, setResetStep] = useState("initiate"); // 'initiate', 'verify-otp', 'verify-question', 'set-password'
  const [resetSessionId, setResetSessionId] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleViewChange = (view) => {
    setAuthError("");
    setAuthSuccess("");
    if (view === "dashboard" && !authService.isAuthenticated()) {
      setCurrentView("login");
    } else {
      setCurrentView(view);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentView("client");
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    try {
      if (currentView === "login") {
        await authService.login(authForm.username, authForm.password);
        setIsAuthenticated(true);
        setCurrentView("dashboard");
      } else if (currentView === "register") {
        await authService.register(
          authForm.email,
          authForm.password,
          authForm.username,
        );
        setAuthSuccess("Registration successful! Please sign in.");
        setCurrentView("login");
      }
    } catch (err) {
      console.error(err);
      setAuthError(
        err.response?.data?.detail ||
          "Authentication failed. Please try again.",
      );
    }
  };

  // Password Reset Handlers
  const handleInitiateReset = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await authService.initiateReset(resetEmail);
      setResetSessionId(res.password_reset_session_id);
      setResetStep("verify-otp");
    } catch (err) {
      setAuthError(
        err.response?.data?.detail || "Failed to initiate password reset.",
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await authService.verifyOtp(resetOtp, resetSessionId);
      setSecurityQuestion(res.security_question);
      setResetSessionId(res.security_question_session_id);
      setResetStep("verify-question");
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Invalid OTP.");
    }
  };

  const handleVerifyQuestion = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await authService.verifySecurityQuestion(
        securityAnswer,
        resetSessionId,
      );
      setResetSessionId(res.password_reset_session_id);
      setResetStep("set-password");
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Incorrect answer.");
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      await authService.setNewPassword(newPassword, resetSessionId);
      setAuthSuccess(
        "Password reset successful! Please log in with your new password.",
      );
      setCurrentView("login");
      setResetStep("initiate");
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Failed to set new password.");
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-hidden">
      <TopNavBar
        currentView={currentView}
        onViewChange={handleViewChange}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {currentView === "client" && <ClientPortalPage />}

      {currentView === "dashboard" && <BrokerDashboardPage />}

      {/* Login / Register Views */}
      {(currentView === "login" || currentView === "register") && (
        <div className="flex-1 flex items-center justify-center bg-surface-container-low p-lg overflow-y-auto">
          <div className="w-full max-w-md bg-surface-container-lowest p-lg rounded-lg border border-outline-variant shadow-sm space-y-md">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-[48px]">
                real_estate_agent
              </span>
              <h2 className="font-headline-xl text-headline-lg font-bold text-on-background mt-xs">
                {currentView === "login"
                  ? "Broker Sign In"
                  : "Create Broker Account"}
              </h2>
              <p className="text-body-sm text-on-surface-variant mt-xs">
                {currentView === "login"
                  ? "Access your property listings dashboard"
                  : "Register to start listing properties"}
              </p>
            </div>

            {authError && (
              <div className="bg-error-container text-on-error-container p-sm rounded text-body-sm">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="bg-secondary-container/20 border border-secondary text-on-secondary-container p-sm rounded text-body-sm">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-md">
              <div>
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={authForm.username}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, username: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="test@example.com"
                />
              </div>

              {currentView === "register" && (
                <div>
                  <label
                    className="block text-label-sm text-on-surface-variant mb-xs"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                    placeholder="broker@example.com"
                  />
                </div>
              )}

              <div>
                <label
                  className="block text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
              >
                {currentView === "login" ? "Sign In" : "Register"}
              </button>
            </form>

            <div className="flex flex-col items-center gap-sm pt-sm border-t border-outline-variant/40 text-body-sm">
              {currentView === "login" ? (
                <>
                  <button
                    onClick={() => setCurrentView("forgot-password")}
                    className="text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                  <p className="text-on-surface-variant">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setCurrentView("register")}
                      className="text-primary font-bold hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                </>
              ) : (
                <p className="text-on-surface-variant">
                  Already have an account?{" "}
                  <button
                    onClick={() => setCurrentView("login")}
                    className="text-primary font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

            {/* Test Credentials Note */}
            {currentView === "login" && (
              <div className="bg-surface-container p-sm rounded text-body-sm text-on-surface-variant text-center border border-outline-variant/30">
                <p className="font-bold text-primary">Test Account:</p>
                <p>
                  Username:{" "}
                  <code className="bg-surface px-1 rounded">
                    test@example.com
                  </code>
                </p>
                <p>
                  Password:{" "}
                  <code className="bg-surface px-1 rounded">testpassword</code>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Forgot Password View */}
      {currentView === "forgot-password" && (
        <div className="flex-1 flex items-center justify-center bg-surface-container-low p-lg overflow-y-auto">
          <div className="w-full max-w-md bg-surface-container-lowest p-lg rounded-lg border border-outline-variant shadow-sm space-y-md">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-[48px]">
                lock_reset
              </span>
              <h2 className="font-headline-xl text-headline-lg font-bold text-on-background mt-xs">
                Reset Password
              </h2>
              <p className="text-body-sm text-on-surface-variant mt-xs">
                Follow the steps to reset your broker password
              </p>
            </div>

            {authError && (
              <div className="bg-error-container text-on-error-container p-sm rounded text-body-sm">
                {authError}
              </div>
            )}

            {resetStep === "initiate" && (
              <form onSubmit={handleInitiateReset} className="space-y-md">
                <div>
                  <label
                    className="block text-label-sm text-on-surface-variant mb-xs"
                    htmlFor="reset-email"
                  >
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                    placeholder="broker@example.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Send OTP
                </button>
              </form>
            )}

            {resetStep === "verify-otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-md">
                <div>
                  <label
                    className="block text-label-sm text-on-surface-variant mb-xs"
                    htmlFor="reset-otp"
                  >
                    Enter OTP
                  </label>
                  <input
                    id="reset-otp"
                    type="text"
                    required
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                    placeholder="123456"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Verify OTP
                </button>
              </form>
            )}

            {resetStep === "verify-question" && (
              <form onSubmit={handleVerifyQuestion} className="space-y-md">
                <div>
                  <p className="text-body-md font-bold text-on-surface mb-sm">
                    {securityQuestion}
                  </p>
                  <label
                    className="block text-label-sm text-on-surface-variant mb-xs"
                    htmlFor="security-answer"
                  >
                    Your Answer
                  </label>
                  <input
                    id="security-answer"
                    type="text"
                    required
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                    placeholder="Answer"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Verify Answer
                </button>
              </form>
            )}

            {resetStep === "set-password" && (
              <form onSubmit={handleSetNewPassword} className="space-y-md">
                <div>
                  <label
                    className="block text-label-sm text-on-surface-variant mb-xs"
                    htmlFor="new-password"
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Set New Password
                </button>
              </form>
            )}

            <div className="text-center pt-sm border-t border-outline-variant/40">
              <button
                onClick={() => setCurrentView("login")}
                className="text-primary hover:underline text-body-sm"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
