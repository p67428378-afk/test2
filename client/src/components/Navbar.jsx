import React from "react";
import { Bell, CheckSquare } from "lucide-react";

export default function Navbar({ activeFilter, onSelectFilter }) {
  return (
    <header className="bg-white border border-[#e3e8f0] px-6 py-4 rounded-xl flex items-center justify-between w-full shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[#2663eb]">
          <CheckSquare className="w-6 h-6" />
          <span className="font-bold text-lg text-[#2663eb] tracking-tight">
            TaskMaster TODOs
          </span>
        </div>
        <nav
          className="hidden md:flex items-center gap-4 text-sm font-medium text-[#707a8c]"
          aria-label="Main Navigation"
        >
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === "all"
                ? "bg-blue-50 text-[#2663eb] font-semibold"
                : "hover:text-[#171c29] hover:bg-gray-50"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === "all"
                ? "text-[#2663eb] font-semibold"
                : "hover:text-[#171c29] hover:bg-gray-50"
            }`}
          >
            All Tasks
          </button>
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter("pending")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === "pending"
                ? "bg-amber-50 text-[#eb9917] font-semibold"
                : "hover:text-[#171c29] hover:bg-gray-50"
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter("completed")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === "completed"
                ? "bg-green-50 text-emerald-600 font-semibold"
                : "hover:text-[#171c29] hover:bg-gray-50"
            }`}
          >
            Completed
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="p-2 text-[#707a8c] hover:text-[#171c29] hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
        <div
          className="bg-[#2663eb] flex items-center justify-center rounded-full w-8 h-8 text-white font-bold text-xs"
          title="User Profile"
        >
          TU
        </div>
      </div>
    </header>
  );
}
