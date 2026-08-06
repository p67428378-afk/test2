import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  ShieldCheck,
  LogOut,
  HeartPulse,
} from "lucide-react";

export default function SidebarNav({ user, onLogout }) {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Lessons & Quizzes", path: "/lessons", icon: BookOpen },
    { name: "Rewards & Badges", path: "/rewards", icon: Award },
    { name: "Parent Portal", path: "/parent", icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 min-h-screen text-slate-100">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800 mb-6">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
            <HeartPulse className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-emerald-400">
              HabitHero Kids
            </h1>
            <p className="text-xs text-slate-400">Health & Routine Learning</p>
          </div>
        </div>

        {/* User Level Badge */}
        {user && (
          <div className="mx-2 mb-6 p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "K"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {user.full_name || user.email || "Kid Hero"}
              </p>
              <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {user.role === "parent" ? "Parent Account" : "Young Explorer"}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
