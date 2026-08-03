import React from "react";
import {
  BookOpen,
  Users,
  FileText,
  DollarSign,
  LogOut,
  User,
  Package,
} from "lucide-react";

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const isLibrarian = user?.role === "librarian";

  const menuItems = isLibrarian
    ? [
        { id: "dashboard", label: "Dashboard", icon: BookOpen },
        { id: "catalog", label: "Book Catalog", icon: FileText },
        { id: "inventory", label: "Inventory", icon: Package },
        { id: "members", label: "Members", icon: Users },
        { id: "fines", label: "Fines", icon: DollarSign },
      ]
    : [
        { id: "portal", label: "My Portal", icon: User },
        { id: "catalog", label: "Search Books", icon: BookOpen },
        { id: "inventory", label: "Inventory", icon: Package },
      ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-emerald-500" />
        <div>
          <h1 className="font-bold text-lg text-slate-100 leading-none">
            LibMax
          </h1>
          <span className="text-xs text-slate-400">Library System</span>
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
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 font-semibold">
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
