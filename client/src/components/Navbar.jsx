import React from "react";
import { NavLink } from "react-router-dom";
import {
  Hotel,
  BedDouble,
  CalendarCheck,
  ConciergeBell,
  Receipt,
  LogOut,
  User,
} from "lucide-react";

export default function Navbar({ currentUser, onLogout }) {
  const navItems = [
    { to: "/rooms", label: "Rooms Inventory", icon: BedDouble },
    { to: "/reservations", label: "Reservations", icon: CalendarCheck },
    { to: "/front-desk", label: "Front Desk", icon: ConciergeBell },
    { to: "/invoices", label: "Billing & Folios", icon: Receipt },
  ];

  return (
    <nav className="bg-[#041627] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">
                Grand Horizon
              </span>
              <span className="text-xs text-blue-300 block -mt-1 font-medium">
                Hotel Management
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-700 text-white shadow-sm"
                        : "text-slate-200 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-medium text-white">
                    {currentUser.full_name || currentUser.email}
                  </span>
                  <span className="text-xs text-blue-300 capitalize">
                    {currentUser.role || "Staff"}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {currentUser.full_name ? (
                    currentUser.full_name[0]
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-xs bg-slate-800 px-3 py-1.5 rounded text-blue-200 border border-slate-700">
                Staff Portal
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex border-t border-slate-800 bg-[#061e35] px-2 py-1 justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-1.5 px-2 rounded text-xs ${
                  isActive ? "text-blue-400 font-semibold" : "text-slate-300"
                }`
              }
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
