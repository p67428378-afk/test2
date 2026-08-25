import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CheckSquare, LogOut, User } from "lucide-react";
import { authService } from "../../services/api";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-[#e3e8f0] flex flex-col h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-[#e3e8f0] flex items-center gap-2">
        <CheckSquare className="h-6 w-6 text-[#2663eb]" />
        <span className="font-bold text-xl text-[#2663eb]">TaskFlow</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#2663eb]/10 text-[#2663eb]"
                : "text-[#707a8c] hover:bg-[#f7fafc] hover:text-[#171c29]"
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#2663eb]/10 text-[#2663eb]"
                : "text-[#707a8c] hover:bg-[#f7fafc] hover:text-[#171c29]"
            }`
          }
        >
          <CheckSquare className="h-5 w-5" />
          My Tasks
        </NavLink>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#e3e8f0] flex flex-col gap-2">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="h-8 w-8 rounded-full bg-[#2663eb]/10 flex items-center justify-center text-[#2663eb]">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#171c29] truncate">User</p>
            <p className="text-xs text-[#707a8c] truncate">Active Session</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#db2626] hover:bg-[#db2626]/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
