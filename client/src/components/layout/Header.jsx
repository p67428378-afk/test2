import React from "react";
import { Bell, HelpCircle, Search } from "lucide-react";
import { authService } from "../../services/api";

export default function Header({ onSearchChange, searchValue }) {
  const user = authService.getCurrentUser();

  return (
    <header className="fixed top-0 right-0 h-16 w-[calc(100%-280px)] bg-[#0b1326] border-b border-slate-800 shadow-sm z-10 flex items-center justify-between px-8">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search reported items..."
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-shadow outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
            2
          </span>
        </button>
        <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden ml-2 border border-slate-700 flex items-center justify-center text-white font-bold text-sm">
          {user?.full_name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
