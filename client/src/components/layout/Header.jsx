import React from "react";
import { Bell, Settings, Search, Store } from "lucide-react";

export default function Header({
  clusterName = "Small Town Value Cluster (#CL-8802)",
  activeTopNav = "scenarios",
  setActiveTopNav,
  onOpenSettings,
  onOpenNotifications,
  user,
}) {
  return (
    <header className="h-16 border-b border-slate-700 bg-slate-800/90 backdrop-blur px-6 flex justify-between items-center sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-6 h-full">
        <div className="flex items-center gap-2 border-r border-slate-700 pr-6">
          <Store className="h-5 w-5 text-amber-500" />
          <h2 className="font-bold text-sm text-slate-100 hidden lg:block">
            Overview Dashboard
          </h2>
          <span className="text-xs text-slate-400 font-normal">
            — {clusterName}
          </span>
        </div>

        {/* Top Navigation Tabs */}
        <nav className="flex h-full items-center gap-1">
          {[
            { id: "scenarios", label: "Scenarios" },
            { id: "performance", label: "Performance" },
            { id: "history", label: "History" },
          ].map((nav) => {
            const isActive = activeTopNav === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTopNav && setActiveTopNav(nav.id)}
                className={`h-full px-3 text-xs font-semibold border-b-[3px] transition-colors ${
                  isActive
                    ? "border-amber-500 text-amber-400 bg-amber-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {nav.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKUs or categories..."
            className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 w-48 sm:w-60 transition-all"
          />
        </div>

        <button
          onClick={onOpenNotifications}
          aria-label="notifications"
          className="p-2 text-slate-400 hover:text-amber-400 transition-colors relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500"></span>
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="settings"
          className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-slate-700 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-100">
              {user?.full_name || "Aarchi Jain"}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">
              {user?.role || "Category Manager"}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-900 font-bold flex items-center justify-center text-xs border border-amber-400">
            {user?.full_name
              ? user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "AJ"}
          </div>
        </div>
      </div>
    </header>
  );
}
