import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HeartPulse,
  Calendar,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-blue-600 font-bold text-xl"
            >
              <HeartPulse className="h-7 w-7" />
              <span>Pet Clinic</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/") || isActive("/pets")
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Pets & Dashboard
              </Link>
              <Link
                to="/appointments"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/appointments")
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Appointments
              </Link>
              <Link
                to="/vaccinations"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/vaccinations")
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Vaccinations & Reminders
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-slate-700">
                  <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold">
                      {user.full_name || user.email}
                    </span>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors py-2 px-3 rounded-md hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
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
