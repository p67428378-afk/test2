import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import CustomerBookingPage from "./pages/CustomerBookingPage";
import PhotographerAvailabilityPage from "./pages/PhotographerAvailabilityPage";
import SessionTrackerPage from "./pages/SessionTrackerPage";
import AdminPackageLedgerPage from "./pages/AdminPackageLedgerPage";
import { authService } from "./services/api";
import { User, Lock, X } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("aura_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      full_name: "Test Administrator",
      email: "test@example.com",
      role: "admin",
    };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("test@example.com");
  const [loginPassword, setLoginPassword] = useState("testpassword");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await authService.login({
        email: loginEmail,
        password: loginPassword,
      });
      setCurrentUser(data);
      setIsLoginModalOpen(false);
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError("Invalid login credentials.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#FBF9F8] text-[#1B1C1C]">
        {/* Global Navigation Bar */}
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onLoginClick={() => setIsLoginModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<CustomerBookingPage />} />
            <Route
              path="/availability"
              element={<PhotographerAvailabilityPage />}
            />
            <Route path="/sessions" element={<SessionTrackerPage />} />
            <Route path="/admin" element={<AdminPackageLedgerPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-[#2C2C2C] text-stone-300 py-8 border-t border-stone-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-serif font-bold text-base text-stone-100">
                Aura Studio
              </p>
              <p className="text-stone-400 mt-1">
                Photography Studio Management System — Session Booking,
                Schedule, & Ledger
              </p>
            </div>
            <div className="text-stone-400 text-right">
              <p>
                QA Test Credentials:{" "}
                <code className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300">
                  test@example.com
                </code>{" "}
                /{" "}
                <code className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300">
                  testpassword
                </code>
              </p>
              <p className="mt-1">
                © {new Date().getFullYear()} Aura Studio. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Sign In to Aura Studio
                </h3>
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loginError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg mb-3">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="p-2 bg-amber-50 rounded text-2xs text-amber-900 border border-amber-200">
                  💡 Note: Default test account is pre-filled (
                  <code className="font-bold">
                    test@example.com / testpassword
                  </code>
                  )
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#775A19] hover:bg-[#5f4613] text-white font-bold py-2.5 rounded-xl shadow-sm text-xs mt-2"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}
