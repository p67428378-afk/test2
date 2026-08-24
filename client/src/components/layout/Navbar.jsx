import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white border border-[#e3e8f0] border-solid flex items-center justify-between px-8 py-4 w-full shadow-sm">
      <div className="flex gap-6 items-center">
        <NavLink
          to="/"
          className="font-bold text-[#2663eb] text-lg hover:opacity-90"
        >
          QuoteGen
        </NavLink>
        <div className="flex gap-6 items-center text-sm font-medium text-[#707a8c]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-[#2663eb] font-semibold" : "hover:text-[#2663eb]"
            }
          >
            Discover
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? "text-[#2663eb] font-semibold" : "hover:text-[#2663eb]"
            }
          >
            Favorites
          </NavLink>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-[#707a8c] hidden sm:inline">
              Hello, {user.full_name || user.email}
            </span>
            <div className="bg-[#2663eb] flex items-center justify-center rounded-full w-8 h-8 text-white font-bold text-xs">
              {getInitials(user.full_name || user.email)}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-[#707a8c] hover:text-red-600 border border-[#e3e8f0] px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="bg-[#2663eb] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
}
