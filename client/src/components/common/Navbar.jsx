import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  Upload,
  FileText,
  Briefcase,
  Lock,
  Activity,
  LogOut,
  User,
} from "lucide-react";

export default function Navbar({ currentUser, onLogout }) {
  const location = useLocation();

  const navItems = [
    { label: "Upload Evidence", path: "/", icon: Upload },
    { label: "Chain of Custody", path: "/custody", icon: FileText },
    { label: "Cases", path: "/cases", icon: Briefcase },
    { label: "RBAC Matrix", path: "/rbac", icon: Lock },
    { label: "Audit Logs", path: "/audit-logs", icon: Activity },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-500 hover:text-blue-400 transition-colors"
        >
          <Shield className="w-7 h-7 text-blue-500" />
          <span>DEMS Portal</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full font-mono">
            CJIS LEVEL 4 SECURED
          </span>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200">
                {currentUser.full_name || currentUser.email}
              </p>
              <span className="text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                {currentUser.role || "Investigator"}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Investigator Alice</span>
          </div>
        )}
      </div>
    </header>
  );
}
