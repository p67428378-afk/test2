import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShieldAlert, LogOut } from "lucide-react";
import { authService } from "../../services/api";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-indigo-600 fill-indigo-600" />
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">
            PawsAdopt
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "text-indigo-600"
                : "text-slate-600 hover:text-indigo-600"
            }`}
          >
            Browse Pets
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className={`text-sm font-medium flex items-center space-x-1 transition-colors ${
                  location.pathname.startsWith("/admin")
                    ? "text-indigo-600"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-600 hover:text-red-600 flex items-center space-x-1 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/admin"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-3 py-1.5 rounded-md transition-colors"
            >
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
