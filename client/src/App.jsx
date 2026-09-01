import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import EMRPage from "./pages/EMRPage";
import BillingPage from "./pages/BillingPage";
import { loginUser, getMe } from "./services/api";
import { Lock, LogIn, Loader2, AlertCircle } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login Modal State with pre-filled test credentials
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("test@example.com");
  const [loginPassword, setLoginPassword] = useState("testpassword");
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await getMe();
          setCurrentUser(user);
        } catch (err) {
          console.warn("Token verification failed", err);
          localStorage.removeItem("token");
        }
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginError(null);

    try {
      const res = await loginUser({
        email: loginEmail,
        password: loginPassword,
      });
      setCurrentUser(res.user);
      setShowLoginModal(false);
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || "Authentication failed";
      setLoginError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-8 max-w-7xl mx-auto">
            {/* Login Prompt Banner if not logged in */}
            {!currentUser && !authLoading && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Demonstration Authentication
                    </h3>
                    <p className="text-xs text-slate-600">
                      Sign in using seed test credentials (
                      <code>test@example.com</code> / <code>testpassword</code>)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Authenticate Portal</span>
                </button>
              </div>
            )}

            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route
                path="/patients"
                element={<PatientsPage onSelectPatient={handleSelectPatient} />}
              />
              <Route
                path="/appointments"
                element={<AppointmentsPage selectedPatient={selectedPatient} />}
              />
              <Route
                path="/emr"
                element={<EMRPage selectedPatient={selectedPatient} />}
              />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="p-2 bg-indigo-600 text-white rounded-lg">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    User Login
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authenticate to access protected endpoints
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                <span className="font-semibold text-slate-700">
                  Pre-filled Test Account:
                </span>
                <div className="mt-1 font-mono">Email: test@example.com</div>
                <div className="font-mono">Password: testpassword</div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loginSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 font-semibold"
                  >
                    {loginSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LogIn className="h-3.5 w-3.5" />
                    )}
                    <span>Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}
