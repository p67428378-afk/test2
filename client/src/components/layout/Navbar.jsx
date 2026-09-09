import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell, User, LogIn, LogOut } from "lucide-react";
import { loginUser, logoutUser } from "../../services/api";

export default function Navbar({
  unreadAlerts = 0,
  currentUser,
  onUserChange,
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);
    try {
      const data = await loginUser(email, password);
      if (onUserChange) onUserChange(data.user);
      setShowAuthModal(false);
    } catch (err) {
      setLoginError(
        err.response?.data?.detail || "Login failed. Please check credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    if (onUserChange) onUserChange(null);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-8">
        <NavLink to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#1C8A5C] flex items-center gap-2">
            <span>🌿</span> SproutCare
          </span>
        </NavLink>
        <nav className="flex space-x-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-[#1C8A5C] font-semibold border-b-2 border-[#1C8A5C] pb-1 transition-colors"
                : "text-gray-500 hover:text-gray-800 transition-colors"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/garden"
            className={({ isActive }) =>
              isActive
                ? "text-[#1C8A5C] font-semibold border-b-2 border-[#1C8A5C] pb-1 transition-colors"
                : "text-gray-500 hover:text-gray-800 transition-colors"
            }
          >
            My Garden
          </NavLink>
          <NavLink
            to="/species"
            className={({ isActive }) =>
              isActive
                ? "text-[#1C8A5C] font-semibold border-b-2 border-[#1C8A5C] pb-1 transition-colors"
                : "text-gray-500 hover:text-gray-800 transition-colors"
            }
          >
            Species Catalog
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <NavLink
          to="/"
          className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          title="Watering Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold animate-pulse">
              {unreadAlerts}
            </span>
          )}
        </NavLink>

        {currentUser ? (
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-full bg-[#1C8A5C] text-white flex items-center justify-center font-bold text-sm shadow-sm"
              title={currentUser.email}
            >
              {currentUser.full_name
                ? currentUser.full_name.slice(0, 2).toUpperCase()
                : currentUser.email.slice(0, 2).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 border border-gray-200 rounded px-2 py-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center space-x-1.5 bg-[#1C8A5C] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#0F4E34] transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Sign In to SproutCare
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Test account prefilled below matching database seed.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mb-4">
              <strong>Test Account:</strong> test@example.com / testpassword
            </div>

            {loginError && (
              <div
                role="alert"
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 mb-4"
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#1C8A5C] text-white rounded-lg text-xs font-semibold hover:bg-[#0F4E34] disabled:opacity-50"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
