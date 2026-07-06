import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Wrench, Zap } from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Service Requests", path: "/service-requests", icon: Wrench },
  ];

  return (
    <aside className="w-64 bg-[#1E293B] border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2">
        <Zap className="h-6 w-6 text-[#10B981]" />
        <span className="text-xl font-bold tracking-wider text-[#F8FAFC]">
          VoltMonitor
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#10B981] text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Operator Profile */}
      <div className="p-4 border-t border-slate-800 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold">
          AR
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#F8FAFC] truncate">
            Alex Rivera
          </p>
          <p className="text-xs text-slate-400 truncate">Lead Technician</p>
        </div>
      </div>
    </aside>
  );
}
