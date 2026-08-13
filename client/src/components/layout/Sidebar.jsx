import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, QrCode } from "lucide-react";

export default function Sidebar() {
  const navItems = [
    {
      name: "Control Center",
      path: "/",
      icon: LayoutDashboard,
      description: "Crowd telemetry & heatmaps",
    },
    {
      name: "Artist Scheduling",
      path: "/scheduling",
      icon: Calendar,
      description: "Stage allocation & slots",
    },
    {
      name: "Volunteer Roster",
      path: "/volunteers",
      icon: Users,
      description: "Shifts & check-ins",
    },
    {
      name: "Gate Scanner",
      path: "/gate-scanner",
      icon: QrCode,
      description: "QR validation & anti-passback",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between">
      <nav className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Operations Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-start space-x-3 px-3 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`
              }
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-[11px] opacity-70 mt-1">
                  {item.description}
                </p>
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">System Status</p>
        <div className="flex items-center justify-between text-[11px]">
          <span>Database API:</span>
          <span className="text-emerald-400 font-medium">Connected</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span>Sub-second Scan:</span>
          <span className="text-emerald-400 font-medium">&lt; 150ms</span>
        </div>
      </div>
    </aside>
  );
}
