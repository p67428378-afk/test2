import React from "react";
import { User, Bell } from "lucide-react";

export default function Header({ user, alertCount = 0, onNavigateToAlerts }) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Welcome back, {user?.name || "User"}
        </h2>
        <p className="text-xs text-slate-500 capitalize">
          Role: {user?.role || "Guest"}
        </p>
      </div>

      <div className="flex items-center gap-6">
        {user?.role === "owner" && (
          <button
            onClick={onNavigateToAlerts}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="View Alerts"
          >
            <Bell className="h-6 w-6" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                {alertCount}
              </span>
            )}
          </button>
        )}

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="bg-slate-100 p-2 rounded-full text-slate-600">
            <User className="h-5 w-5" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-slate-700">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-400">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
