import React from "react";
import { Shield, LogOut, Radio, User } from "lucide-react";

export default function Navbar({ currentUser, onLogout }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            FestControl{" "}
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">
              PRO
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Music Festival Operations Platform
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>LIVE TELEMETRY</span>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-medium text-slate-200">
                  {currentUser.full_name || currentUser.email}
                </p>
                <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                  {currentUser.role || "STAFF"}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
