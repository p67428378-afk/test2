import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white border border-[#e0e5f0] border-solid flex items-center justify-between px-8 py-4 w-full rounded-2xl shadow-sm mb-6">
      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="font-bold text-[#4f45e5] text-lg hover:opacity-90 transition-opacity"
        >
          🌟 Healthy Habits Hero
        </Link>
        {user && (
          <div className="flex gap-6 items-center text-[#63738c] text-sm font-medium">
            <Link
              to="/"
              className={`hover:text-primary transition-colors ${
                location.pathname === "/" ? "text-primary font-bold" : ""
              }`}
            >
              My Dashboard
            </Link>
            {user.role === "parent" && (
              <Link
                to="/parent"
                className={`hover:text-primary transition-colors ${
                  location.pathname === "/parent"
                    ? "text-primary font-bold"
                    : ""
                }`}
              >
                Parent Portal
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-[#63738c] hidden sm:inline">
              Hi, <strong className="text-[#1f293b]">{user.username}</strong> (
              {user.role})
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-error hover:underline font-medium"
            >
              Log Out 🚪
            </button>
            <div className="bg-[#4f45e5] flex items-center justify-center rounded-full w-8 h-8">
              <p className="font-bold text-xs text-white">
                {getInitials(user.username)}
              </p>
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-opacity-90 transition-colors"
          >
            Log In 🔑
          </Link>
        )}
      </div>
    </div>
  );
}
