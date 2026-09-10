import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FileText, LogIn, LogOut, Sparkles, UserPlus } from "lucide-react";

export default function TopNavBar({ onExportPdf, isExporting = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand & Nav Links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="flex items-center space-x-2.5 text-indigo-600 hover:text-indigo-700 transition"
          aria-label="Quick CV Home"
        >
          <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            Quick CV
          </span>
        </Link>

        <nav className="hidden sm:flex items-center space-x-4">
          <Link
            to="/builder"
            className={`text-sm font-medium transition ${
              location.pathname === "/builder"
                ? "text-indigo-600 font-semibold"
                : "text-slate-600 hover:text-indigo-600"
            }`}
          >
            Resume Builder
          </Link>
          {!isAuthenticated && (
            <Link
              to="/login"
              className={`text-sm font-medium transition ${
                location.pathname === "/login" || location.pathname === "/"
                  ? "text-indigo-600 font-semibold"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Login / Sign In
            </Link>
          )}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {isAuthenticated && user ? (
          <>
            <span className="hidden md:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ✓ Saved to Cloud
            </span>

            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {user.full_name
                  ? user.full_name.charAt(0).toUpperCase()
                  : user.email
                    ? user.email.charAt(0).toUpperCase()
                    : "U"}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 max-w-[120px] sm:max-w-[180px] truncate">
                {user.full_name || user.email}
              </span>
            </div>

            {onExportPdf && (
              <button
                type="button"
                onClick={onExportPdf}
                disabled={isExporting}
                className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </button>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-red-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>Login / Sign In</span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
