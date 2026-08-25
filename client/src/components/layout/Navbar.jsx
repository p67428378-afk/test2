import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, Search, LogOut, UserCheck } from "lucide-react";
import { authService } from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🚔</span>
              <span className="font-bold text-lg text-blue-700 tracking-tight">
                City Parking Enforcement
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Public Citation Lookup</span>
            </Link>

            <Link
              to="/admin"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin")
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Admin Session</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-slate-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="sr-only">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
              >
                Admin Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
