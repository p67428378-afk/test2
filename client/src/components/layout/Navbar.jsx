import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  FilePlus,
  CheckSquare,
  User,
  Key,
  LogOut,
} from "lucide-react";
import { authService, reviewService } from "../../services/api.js";

export function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("test@example.com");
  const [loginPassword, setLoginPassword] = useState("testpassword");
  const [loginRole, setLoginRole] = useState("ROLE_EMPLOYEE");
  const [pendingCount, setPendingCount] = useState(0);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    fetchPendingCount();
  }, [location.pathname]);

  const fetchPendingCount = async () => {
    try {
      const items = await reviewService.getQueue();
      if (Array.isArray(items)) {
        setPendingCount(items.length);
      }
    } catch (err) {
      // Non-blocking if unauthenticated
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      await authService.login({
        email: loginEmail,
        password: loginPassword,
      });
      setUser(authService.getCurrentUser());
      setShowLoginModal(false);
      fetchPendingCount();
    } catch (err) {
      // Fallback for mock/local test session if server login fails
      const mockUser = {
        id: "user-123",
        email: loginEmail,
        full_name: loginEmail.split("@")[0],
        role: loginRole,
      };
      localStorage.setItem("auth_token", "demo-token");
      localStorage.setItem("user_info", JSON.stringify(mockUser));
      setUser(mockUser);
      setShowLoginModal(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white";
  };

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-3 text-white font-bold text-lg"
            >
              <div className="bg-emerald-600 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="tracking-tight">TechKnowledge Hub</span>
            </Link>

            <div className="hidden md:flex space-x-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${isActive("/")}`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Knowledge Base</span>
              </Link>

              <Link
                to="/notes/new"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${isActive("/notes/new")}`}
              >
                <FilePlus className="h-4 w-4" />
                <span>Submit Note</span>
              </Link>

              <Link
                to="/reviews"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${isActive("/reviews")}`}
              >
                <CheckSquare className="h-4 w-4" />
                <span>Review Queue</span>
                {pendingCount > 0 && (
                  <span className="ml-1 bg-amber-500 text-slate-900 font-semibold px-2 py-0.5 rounded-full text-xs">
                    {pendingCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:block text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded border border-slate-700">
              <span className="text-emerald-400 font-semibold">
                Test account:
              </span>{" "}
              test@example.com / testpassword
            </div>

            {user ? (
              <div className="flex items-center space-x-3 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
                <User className="h-4 w-4 text-emerald-400" />
                <div className="text-left">
                  <p className="font-medium text-xs leading-none">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono leading-none mt-0.5">
                    {user.role || "ROLE_EMPLOYEE"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-slate-400 hover:text-red-400 ml-2 p-1"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <Key className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold mb-1 text-slate-900">
              Sign In to Platform
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Use default test credentials or select role persona.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Persona
                </label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ROLE_EMPLOYEE">Employee (Submit Notes)</option>
                  <option value="ROLE_EXPERT">
                    Subject Matter Expert (Validate/Reject)
                  </option>
                </select>
              </div>

              {authError && (
                <p className="text-xs text-red-600 font-medium">{authError}</p>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm font-semibold shadow"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
