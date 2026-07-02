import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldAlert,
  LayoutDashboard,
  FilePlus,
  Settings,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard },
    { path: "/report", name: "Report Incident", icon: FilePlus },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <ShieldAlert className="h-8 w-8 text-red-500 animate-pulse" />
        <div>
          <h1 className="font-bold text-lg tracking-tight">IT Incident</h1>
          <p className="text-xs text-slate-400 font-medium">
            SLA & RCA Tracker
          </p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v1.0.0 &bull; BFSI Enterprise
      </div>
    </aside>
  );
}
