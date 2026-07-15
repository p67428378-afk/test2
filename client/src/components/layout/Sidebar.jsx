import React from "react";
import { LayoutDashboard, BarChart2, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col fixed h-full w-[280px] left-0 top-0 bg-[#1E293B] border-r border-[#334155] py-6 z-20">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-[#6366F1] flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[#6366F1]/30">
          C
        </div>
        <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
          Chronos
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 flex-grow px-3">
        {/* Dashboard (Active) */}
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 bg-[#6366F1]/10 border-l-4 border-[#6366F1] text-[#F8FAFC] font-semibold transition-all duration-200"
        >
          <LayoutDashboard size={18} className="text-[#6366F1]" />
          <span className="text-sm">Dashboard</span>
        </a>

        {/* Analytics (Inactive) */}
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-[#94A3B8] border-l-4 border-transparent hover:bg-[#334155] hover:text-[#F8FAFC] transition-colors text-sm font-medium"
        >
          <BarChart2 size={18} />
          <span>Analytics</span>
        </a>

        {/* Settings (Inactive) */}
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-[#94A3B8] border-l-4 border-transparent hover:bg-[#334155] hover:text-[#F8FAFC] transition-colors text-sm font-medium"
        >
          <Settings size={18} />
          <span>Settings</span>
        </a>
      </div>

      {/* User Profile Anchor */}
      <div className="px-6 mt-auto pt-6 border-t border-[#334155] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#334155] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[#475569]">
          <span className="font-bold text-sm text-[#F8FAFC]">AM</span>
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-[#F8FAFC] truncate">
            Alex Mercer
          </p>
          <p className="text-xs text-[#94A3B8] truncate">Student</p>
        </div>
      </div>
    </nav>
  );
}
