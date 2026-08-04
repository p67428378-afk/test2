import React from "react";
import {
  LayoutDashboard,
  ListFilter,
  Network,
  Sparkles,
  History,
  Warehouse,
  Users,
  User,
  LogOut,
  Store,
} from "lucide-react";

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "sku", label: "SKU View", icon: ListFilter },
    { id: "cluster", label: "Cluster Select", icon: Network },
    { id: "optimization", label: "Optimization", icon: Sparkles },
    { id: "audit", label: "Audit Log", icon: History },
    { id: "inventory", label: "Inventory", icon: Warehouse },
    { id: "team", label: "Team Members", icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen sticky top-0 shrink-0 z-40">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center font-bold text-slate-900 text-sm shrink-0 shadow-sm">
            DG
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-100 leading-tight">
              Assortment Advisor
            </h1>
            <p className="text-[10px] text-amber-400/90 uppercase tracking-widest font-semibold mt-0.5">
              Enterprise Portal
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400 flex items-center gap-1.5">
          <Store className="h-3.5 w-3.5 text-amber-500" />
          <span>Small Town Value Cluster</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" role="tablist">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab && setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                isActive
                  ? "bg-amber-500/20 text-amber-400 border-l-[3px] border-amber-500 font-bold shadow-xs"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border-l-[3px] border-transparent"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-amber-500" : "text-slate-400"}`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-slate-700 text-amber-400 flex items-center justify-center font-bold text-xs border border-slate-600">
            {user?.full_name?.charAt(0) || "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {user?.full_name || "Aarchi Jain"}
            </p>
            <p className="text-[10px] text-slate-400 capitalize truncate">
              {user?.role || "Category Manager"}
            </p>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
