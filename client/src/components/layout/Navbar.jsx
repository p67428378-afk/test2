import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, User, LogOut, Shield, Bell, Key } from "lucide-react";
import { authAPI } from "../../services/api";

export default function Navbar({ currentUser, onUserChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Donor");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    onUserChange(null);
    navigate("/");
  };

  const fillQuickAuth = (userType) => {
    if (userType === "admin") {
      setEmail("admin@example.com");
      setPassword("adminpassword");
      setRole("Admin");
    } else {
      setEmail("test@example.com");
      setPassword("testpassword");
      setRole("Donor");
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      if (isRegister) {
        await authAPI.register({
          email,
          password,
          full_name: fullName || "Test Donor",
          role,
        });
        // Auto login after register
        const data = await authAPI.login(email, password);
        onUserChange(data.user);
      } else {
        const data = await authAPI.login(email, password);
        onUserChange(data.user);
      }
      setShowLoginModal(false);
    } catch (err) {
      setLoginError(
        err.response?.data?.detail ||
          "Authentication failed. Please check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight"
            >
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span>GiveHope Portal</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link
                to="/"
                className={`transition-colors hover:text-blue-600 ${isActive("/") ? "text-blue-600 font-semibold" : ""}`}
              >
                Campaigns
              </Link>
              {currentUser && (
                <Link
                  to="/my-donations"
                  className={`transition-colors hover:text-blue-600 ${isActive("/my-donations") ? "text-blue-600 font-semibold" : ""}`}
                >
                  My Donations
                </Link>
              )}
              {currentUser?.role === "Admin" && (
                <>
                  <Link
                    to="/admin/campaigns"
                    className={`transition-colors hover:text-blue-600 ${isActive("/admin/campaigns") ? "text-blue-600 font-semibold" : ""}`}
                  >
                    Admin Campaigns
                  </Link>
                  <Link
                    to="/admin/donations"
                    className={`transition-colors hover:text-blue-600 ${isActive("/admin/donations") ? "text-blue-600 font-semibold" : ""}`}
                  >
                    Donation Audit Ledger
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* User Profile / Login Action */}
          <div className="flex items-center gap-4">
            <button
              className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
                    {currentUser.full_name
                      ? currentUser.full_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {currentUser.full_name || currentUser.email}
                  </span>
                  {currentUser.role === "Admin" && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {isRegister ? "Create an Account" : "Sign In to GiveHope"}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              {isRegister
                ? "Join our community of donors"
                : "Access your donation history and manage campaigns"}
            </p>

            {/* Quick Fill Credentials Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-900">
              <div className="font-semibold flex items-center gap-1 mb-1">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick Test Credentials:</span>
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => fillQuickAuth("donor")}
                  className="bg-white hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-300 font-medium transition-colors"
                >
                  Donor (test@example.com)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickAuth("admin")}
                  className="bg-white hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-300 font-medium transition-colors"
                >
                  Admin (admin@example.com)
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs mb-4">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Donor">Donor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow mt-2 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : isRegister
                    ? "Register"
                    : "Sign In"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setLoginError("");
                }}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                {isRegister
                  ? "Already have an account? Sign In"
                  : "Need an account? Register as Donor or Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
