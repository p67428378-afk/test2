import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Sprout,
  ShieldAlert,
  CalendarCheck,
  Bell,
  User,
} from "lucide-react";

export default function Navbar() {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Hives Inventory", path: "/hives", icon: Box },
    { name: "Harvest Tracker", path: "/harvests", icon: Sprout },
    { name: "Disease Reports", path: "/diseases", icon: ShieldAlert },
    { name: "Inspections", path: "/inspections", icon: CalendarCheck },
  ];

  return (
    <nav
      className="bg-white border-b border-[#e3e8f0] px-6 py-4 shadow-sm"
      data-name="Navbar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-[#2663eb]"
          >
            <span role="img" aria-label="bee">
              🐝
            </span>
            <span>BeeHive Monitor</span>
          </NavLink>
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#2663eb] font-bold border-b-2 border-[#2663eb] pb-1"
                        : "text-[#707a8c] hover:text-[#171c29]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-label="Notifications"
            className="p-2 text-[#707a8c] hover:text-[#171c29] relative rounded-full hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 border-l pl-4 border-[#e3e8f0]">
            <div className="w-8 h-8 rounded-full bg-[#2663eb] text-white flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#171c29]">Apiary Manager</p>
              <p className="text-[#707a8c]">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
