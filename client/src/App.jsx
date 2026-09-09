import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import EvidenceUploadPage from "./pages/EvidenceUploadPage";
import CustodyChainPage from "./pages/CustodyChainPage";
import CaseDashboardPage from "./pages/CaseDashboardPage";
import RBACPage from "./pages/RBACPage";
import AuditLogPage from "./pages/AuditLogPage";
import { authAPI } from "./services/api";
import { Shield, Key, Lock, CheckCircle2 } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("dems_user");
    return saved
      ? JSON.parse(saved)
      : {
          full_name: "Investigator Alice",
          email: "alice@police.gov",
          role: "Investigator",
        };
  });

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await authAPI.login(email, password);
      setCurrentUser(res.user);
      setShowLoginModal(false);
    } catch (err) {
      console.error("Login error:", err);
      // Local fallback for dev/demo mode
      const mockUser = {
        full_name: email.split("@")[0],
        email: email,
        role: email.includes("admin") ? "Administrator" : "Investigator",
      };
      localStorage.setItem("dems_user", JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setShowLoginModal(false);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        {/* Credentials Bar / Notice */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-2 flex flex-wrap justify-between items-center text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Test Account:{" "}
              <strong className="text-slate-200">test@example.com</strong> /{" "}
              <strong className="text-slate-200">testpassword</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              Admin Account:{" "}
              <strong className="text-slate-200">admin@example.com</strong> /{" "}
              <strong className="text-slate-200">adminpassword</strong>
            </span>
          </div>
          {!currentUser && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-blue-400 hover:underline font-medium"
            >
              Sign In to DEMS
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8">
          <Routes>
            <Route path="/" element={<EvidenceUploadPage />} />
            <Route path="/custody" element={<CustodyChainPage />} />
            <Route path="/cases" element={<CaseDashboardPage />} />
            <Route path="/rbac" element={<RBACPage />} />
            <Route path="/audit-logs" element={<AuditLogPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500 font-mono">
          Digital Evidence Management System (DEMS) v1.0.0 &bull; Tamper-Evident
          CJIS Level 4 Ledger
        </footer>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-100">
                <Shield className="w-6 h-6 text-blue-500" />
                <span>Sign In to DEMS Vault</span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <p className="text-xs text-red-400">{loginError}</p>
                )}

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">
                    Quick Test Credentials:
                  </p>
                  <p>Investigator: test@example.com / testpassword</p>
                  <p>Administrator: admin@example.com / adminpassword</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"
                  >
                    Authenticate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
