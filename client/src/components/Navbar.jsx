import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Droplet, LogOut, User, Shield } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-900/50 text-purple-300 border-purple-700";
      case "OPERATOR":
        return "bg-blue-900/50 text-blue-300 border-blue-700";
      case "DRIVER":
        return "bg-amber-900/50 text-amber-300 border-amber-700";
      case "CUSTOMER":
      default:
        return "bg-emerald-900/50 text-emerald-300 border-emerald-700";
    }
  };

  return (
    <nav className="bg-slate-800/80 border-b border-slate-700/60 backdrop-blur sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-sky-400 font-bold text-xl tracking-tight"
        >
          <Droplet className="w-6 h-6 fill-sky-400" />
          <span>AquaFlow Dispatch</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 rounded-full border border-slate-700 text-sm">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-200 font-medium">{user.email}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}
              >
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
