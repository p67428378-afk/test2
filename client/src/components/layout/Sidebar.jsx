import React from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Wrench,
  LogOut,
  Sun,
} from "lucide-react";

export default function Sidebar({ role, activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["owner", "technician"],
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: AlertTriangle,
      roles: ["owner"],
    },
    {
      id: "requests",
      label: "Service Requests",
      icon: Wrench,
      roles: ["technician"],
    },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <Sun className="h-8 w-8 text-amber-400 animate-pulse" />
        <div>
          <h1 className="font-bold text-lg tracking-tight">Helios</h1>
          <p className="text-xs text-slate-400">Solar Monitoring</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
