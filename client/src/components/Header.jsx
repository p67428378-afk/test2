import React from "react";
import { authService } from "../services/api";
import { Bell, Search } from "lucide-react";

export default function Header({ title }) {
  const user = authService.getCurrentUser();

  return (
    <header className="bg-white border-b border-slate-200 flex justify-between items-center px-8 h-16 w-full z-10 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-lg text-slate-800">
          {title || "Dashboard"}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64 text-slate-700"
            placeholder="Search..."
            type="text"
          />
        </div>
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:inline">
            {user?.full_name}
          </span>
        </div>
      </div>
    </header>
  );
}
