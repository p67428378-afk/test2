import React from "react";
import { NavLink } from "react-router-dom";
import {
  Utensils,
  Building2,
  Truck,
  Shield,
  LayoutDashboard,
} from "lucide-react";

export default function Sidebar({ userRole }) {
  const getNavItems = () => {
    switch (userRole) {
      case "donor":
        return [{ name: "Donor Dashboard", path: "/donor", icon: Utensils }];
      case "ngo":
        return [{ name: "NGO Portal", path: "/ngo", icon: Building2 }];
      case "volunteer":
        return [{ name: "Volunteer Portal", path: "/volunteer", icon: Truck }];
      case "admin":
        return [{ name: "Admin Console", path: "/admin", icon: Shield }];
      default:
        return [{ name: "Dashboard", path: "/", icon: LayoutDashboard }];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
        Role Portal
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500 px-3">
        <p>Food Freshness Status:</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>FRESH</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          <span>WARNING</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
          <span>EXPIRED</span>
        </div>
      </div>
    </aside>
  );
}
