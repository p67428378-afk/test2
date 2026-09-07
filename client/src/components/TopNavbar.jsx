import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, BookOpen, Bell, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const TopNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center bg-indigo-950 text-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-white hover:text-amber-400"
        >
          <BookOpen className="w-6 h-6 text-amber-500" />
          <span>LMS Portal</span>
        </Link>
        {user?.role === "faculty" && (
          <span className="bg-indigo-800 text-amber-300 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
            Faculty
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search courses..."
            className="pl-9 pr-3 py-1.5 text-black bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          aria-label="Notifications"
          className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-indigo-900"
        >
          <Bell className="w-5 h-5" />
        </button>

        {user && (
          <div className="flex items-center gap-3 border-l border-indigo-800 pl-4">
            <div className="w-8 h-8 bg-amber-500 text-indigo-950 rounded-full flex items-center justify-center font-bold text-xs">
              {user.full_name ? (
                user.full_name.charAt(0).toUpperCase()
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-semibold text-white">{user.full_name}</p>
              <p className="text-indigo-300 capitalize">{user.role}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-300 hover:text-red-400 rounded-md hover:bg-indigo-900 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavbar;
