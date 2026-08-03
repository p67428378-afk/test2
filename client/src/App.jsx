import React, { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";
import CommuterDashboard from "./pages/CommuterDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Import existing library pages
import LibrarianDashboard from "./pages/LibrarianDashboard.jsx";
import MemberPortal from "./pages/MemberPortal.jsx";
import BookCatalogManagement from "./pages/BookCatalogManagement.jsx";
import InventoryDashboardPage from "./pages/InventoryDashboardPage.jsx";
import InventoryFormPage from "./pages/InventoryFormPage.jsx";

import Button from "./components/common/Button.jsx";
import { authService } from "./services/api.js";
import { Bus, Lock, Mail, Phone, Key, HelpCircle } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("token");
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState("commuter-dashboard");
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);

  // Login form state
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loginError, setLoginError] = useState("");

  // Password reset state
  const [resetStep, setResetStep] = useState("none"); // 'none', 'initiate', 'otp', 'question', 'new_password'
  const [resetLoginId, setResetLoginId] = useState("");
  const [resetMobile, setResetMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securitySessionId, setSecurityQuestionSessionId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordResetSessionId, setPasswordResetSessionId] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");

  // Library sub-tab state
  const [libraryTab, setLibraryTab] = useState("dashboard");

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error(err);
          authService.logout();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await authService.login(email, password);
      setToken(data.access_token);
    } catch (err) {
      setLoginError(err.response?.data?.detail || "Invalid email or password.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // Password Reset Handlers
  const handleInitiateReset = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await authService.initiatePasswordReset(
        resetLoginId,
        resetMobile,
      );
      setOtpSessionId(data.otp_session_id);
      setSecurityQuestion(data.security_question);
      setResetStep("otp");
    } catch (err) {
      setLoginError(
        err.response?.data?.detail || "Failed to initiate password reset.",
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await authService.verifyOtp(otpCode, otpSessionId);
      setSecurityQuestionSessionId(data.security_question_session_id);
      setResetStep("question");
    } catch (err) {
      setLoginError(err.response?.data?.detail || "Invalid OTP code.");
    }
  };

  const handleVerifyQuestion = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await authService.verifySecurityQuestion(
        securityAnswer,
        securitySessionId,
      );
      setPasswordResetSessionId(data.password_reset_session_id);
      setResetStep("new_password");
    } catch (err) {
      setLoginError(err.response?.data?.detail || "Incorrect security answer.");
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await authService.setNewPassword(newPassword, passwordResetSessionId);
      setResetSuccessMessage(
        "Password reset successfully! Please log in with your new password.",
      );
      setResetStep("none");
      setEmail(resetLoginId);
      setPassword("");
    } catch (err) {
      setLoginError(
        err.response?.data?.detail || "Failed to set new password.",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading application...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
              <Bus className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Welcome to TransitMax
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Real-Time Bus Tracking & Transit System
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
              {loginError}
            </div>
          )}

          {resetSuccessMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
              {resetSuccessMessage}
            </div>
          )}

          {resetStep === "none" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-400 uppercase"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="test@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold text-slate-400 uppercase"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep("initiate");
                      setLoginError("");
                      setResetSuccessMessage("");
                    }}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500"
              >
                Sign In
              </Button>

              <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Test Accounts:</p>
                <p>
                  • Librarian:{" "}
                  <code className="text-indigo-400">librarian@example.com</code>{" "}
                  / <code className="text-indigo-400">testpassword</code>
                </p>
                <p>
                  • Member:{" "}
                  <code className="text-indigo-400">test@example.com</code> /{" "}
                  <code className="text-indigo-400">testpassword</code>
                </p>
              </div>
            </form>
          )}

          {resetStep === "initiate" && (
            <form onSubmit={handleInitiateReset} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">
                Reset Password
              </h3>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  Login ID (Email)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={resetLoginId}
                    onChange={(e) => setResetLoginId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="test@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={resetMobile}
                    onChange={(e) => setResetMobile(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setResetStep("none")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                >
                  Send OTP
                </Button>
              </div>
            </form>
          )}

          {resetStep === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">
                Verify OTP
              </h3>
              <p className="text-xs text-slate-400">
                Enter the OTP code sent to your mobile number.
              </p>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  OTP Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setResetStep("initiate")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                >
                  Verify OTP
                </Button>
              </div>
            </form>
          )}

          {resetStep === "question" && (
            <form onSubmit={handleVerifyQuestion} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">
                Security Question
              </h3>
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300">
                <p className="font-semibold text-slate-400 text-xs uppercase">
                  Question:
                </p>
                <p className="mt-1">{securityQuestion}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  Your Answer
                </label>
                <div className="relative">
                  <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Answer"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setResetStep("otp")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                >
                  Verify Answer
                </Button>
              </div>
            </form>
          )}

          {resetStep === "new_password" && (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">
                Set New Password
              </h3>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500"
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "commuter-dashboard":
        return <CommuterDashboard />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "library-dashboard":
        return (
          <div className="space-y-6">
            {/* Library Sub-Navigation */}
            <div className="flex border-b border-slate-800 gap-4">
              <button
                onClick={() => setLibraryTab("dashboard")}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  libraryTab === "dashboard"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Librarian Dashboard
              </button>
              <button
                onClick={() => setLibraryTab("portal")}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  libraryTab === "portal"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Member Portal
              </button>
              <button
                onClick={() => setLibraryTab("catalog")}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  libraryTab === "catalog"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Book Catalog
              </button>
              <button
                onClick={() => setLibraryTab("inventory")}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  libraryTab === "inventory"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Inventory
              </button>
            </div>

            {/* Render Library Sub-Tab */}
            {libraryTab === "dashboard" && <LibrarianDashboard />}
            {libraryTab === "portal" && <MemberPortal user={user} />}
            {libraryTab === "catalog" && <BookCatalogManagement />}
            {libraryTab === "inventory" && (
              <InventoryDashboardPage
                user={user}
                onAddItem={() => {
                  setEditingItemId(null);
                  setLibraryTab("inventory-form");
                }}
                onEditItem={(itemId) => {
                  setEditingItemId(itemId);
                  setLibraryTab("inventory-form");
                }}
              />
            )}
            {libraryTab === "inventory-form" && (
              <InventoryFormPage
                itemId={editingItemId}
                onCancel={() => setLibraryTab("inventory")}
                onSave={() => setLibraryTab("inventory")}
              />
            )}
          </div>
        );
      default:
        return <CommuterDashboard />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "commuter-dashboard":
        return "TransitMax Bus Tracker";
      case "admin-dashboard":
        return "TransitMax Route Manager";
      case "library-dashboard":
        return "LibMax Library System";
      default:
        return "TransitMax Bus Tracking App";
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} title={getHeaderTitle()} />
        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
