import React from "react";
import { Activity, Bell, User, LogOut } from "lucide-react";
import { logoutUser } from "../../services/api";

export default function Navbar({ currentUser, onLogout }) {
  const handleLogout = () => {
    logoutUser();
    if (onLogout) onLogout();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-none">
            ApexCare HMS
          </h1>
          <span className="text-xs text-slate-500 font-medium">
            Hospital Management Portal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Test Credentials banner info */}
        <div className="hidden md:flex items-center gap-2 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="font-semibold text-slate-700">Test Account:</span>
          <code>test@example.com / testpassword</code>
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800">
              {currentUser?.email || "Dr. Alex Morgan"}
            </div>
            <div className="text-xs text-slate-500">
              {currentUser?.role || "Administrator"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
