import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  BarChart3,
  LogOut,
  Home,
} from "lucide-react";
import { adminService } from "../../services/api";

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/events/new", label: "Create Event", icon: CalendarPlus },
  ];

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/20 min-h-[calc(100vh-4rem)] p-lg flex flex-col justify-between">
      <div className="flex flex-col gap-lg">
        <div className="px-2 py-1">
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
            Admin Controls
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-all"
        >
          <Home className="w-5 h-5" />
          <span>Back to Site</span>
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-error hover:bg-error-container/20 transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
