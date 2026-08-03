import React from "react";
import {
  MapPin,
  Settings,
  BookOpen,
  LogOut,
  User,
  Bus,
  Navigation,
} from "lucide-react";

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const isLibrarian = user?.role === "librarian";

  const menuItems = [
    { id: "commuter-dashboard", label: "Bus Tracker", icon: Navigation },
    { id: "admin-dashboard", label: "Route Manager", icon: Settings },
    { id: "library-dashboard", label: "Library System", icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <Bus className="h-8 w-8 text-indigo-500" />
        <div>
          <h1 className="font-bold text-lg text-slate-100 leading-none">
            TransitMax
          </h1>
          <span className="text-xs text-slate-400">Bus Tracking App</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-semibold border border-slate-700">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user?.full_name || "User"}
            </p>
            <p className="text-xs text-slate-400 capitalize truncate">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
