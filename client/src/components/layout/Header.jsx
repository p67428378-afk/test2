import React from "react";
import { Bell, Search, ChevronDown } from "lucide-react";

export default function Header({ title }) {
  return (
    <header className="h-16 bg-[#1E293B] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Title */}
      <h1 className="text-xl font-bold text-[#F8FAFC]">{title}</h1>

      {/* Search & Utilities */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search telemetry, tickets..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-1.5 text-sm text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-[#EF4444] rounded-full border-2 border-[#1E293B]"></span>
        </button>

        {/* User Dropdown */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1.5 rounded-lg transition-colors">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
            AR
          </div>
          <span className="text-sm font-medium text-slate-300 hidden md:inline">
            Alex Rivera
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
