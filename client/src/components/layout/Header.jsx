import React from "react";
import { Bell, Search, User } from "lucide-react";

export default function Header({ user, title }) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500"></span>
          </button>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-200">
              {user?.full_name}
            </p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-semibold border border-indigo-500/20">
            {user?.full_name?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
