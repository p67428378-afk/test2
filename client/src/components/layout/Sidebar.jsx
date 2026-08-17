import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  ShieldCheck,
  History,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { logoutUser } from "../../services/api";

export default function Sidebar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("user_email") || "User";
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#2a313d] text-white flex flex-col py-8 px-4 z-40 shadow-lg transition-all duration-200 ease-in-out">
      <div className="mb-8 px-4 flex items-center gap-2">
        <ClipboardList className="w-8 h-8 text-[#c3c0ff]" />
        <span className="font-bold text-xl tracking-tight text-[#e2dfff]">
          Dairy L&F
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-white/10 text-[#c3c0ff] font-bold"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/report"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-white/10 text-[#c3c0ff] font-bold"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <FilePlus className="w-5 h-5" />
          <span>Report Item</span>
        </NavLink>

        {isAdmin && (
          <>
            <NavLink
              to="/admin/verify"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-[#c3c0ff] font-bold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Verify Claims</span>
            </NavLink>

            <NavLink
              to="/admin/history"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-[#c3c0ff] font-bold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <History className="w-5 h-5" />
              <span>Claim History</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="px-4 py-3 mb-4 bg-white/5 rounded-lg overflow-hidden">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Logged in as
          </p>
          <p
            className="text-sm font-semibold text-[#e2dfff] truncate"
            title={email}
          >
            {email}
          </p>
          {isAdmin && (
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded">
              Admin
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg font-medium transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
