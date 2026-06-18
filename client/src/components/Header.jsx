import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#051424]/80 backdrop-blur-xl h-16 z-40 border-b border-outline-variant/10 shadow-sm flex items-center justify-between px-8 flex-shrink-0">
      {/* Search */}
      <div className="flex items-center w-96 relative">
        <Search className="absolute left-3 text-on-surface-variant w-5 h-5" />
        <input
          className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-on-surface-variant/50"
          placeholder="Search payments..."
          type="text"
        />
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-6">
        {/* Status */}
        <div className="flex items-center gap-2 hidden lg:flex px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 status-dot-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            All Systems Operational
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-variant/30 rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
            2
          </span>
        </button>

        {/* Action Button */}
        <button
          onClick={() => navigate("/initiate")}
          className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_10px_rgba(99,102,241,0.2)]"
        >
          Initiate Payment
        </button>
      </div>
    </header>
  );
}
