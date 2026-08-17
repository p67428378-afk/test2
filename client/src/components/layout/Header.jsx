import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Search, Bell, User as UserIcon, LogOut } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items, locations, or descriptions..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </button>

        {user ? (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-slate-800">
                {user.full_name || "User"}
              </div>
              <div className="text-xs text-slate-500 capitalize">
                {user.role || "user"} • {user.email}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition ml-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Sign In
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
