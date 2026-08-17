import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  LogOut,
  User,
  Shield,
  Truck,
  Building2,
  Utensils,
} from "lucide-react";
import { authApi } from "../../services/api";

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2 text-emerald-400 font-bold text-xl"
            >
              <Utensils className="h-6 w-6 text-emerald-400" />
              <span>FoodRescue</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  {currentUser.role === "donor" && (
                    <Utensils className="h-4 w-4 text-emerald-400" />
                  )}
                  {currentUser.role === "ngo" && (
                    <Building2 className="h-4 w-4 text-emerald-400" />
                  )}
                  {currentUser.role === "volunteer" && (
                    <Truck className="h-4 w-4 text-emerald-400" />
                  )}
                  {currentUser.role === "admin" && (
                    <Shield className="h-4 w-4 text-emerald-400" />
                  )}
                  <span className="text-sm font-medium text-slate-200">
                    {currentUser.name}
                  </span>
                  <span className="text-xs uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
