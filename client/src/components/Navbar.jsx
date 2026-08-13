import React from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  Calendar,
  Users,
  QrCode,
  ShieldCheck,
  Music2,
} from "lucide-react";

export const Navbar = () => {
  const navItems = [
    { to: "/", label: "Crowd Analytics", icon: Activity },
    { to: "/schedule", label: "Stage Schedule", icon: Calendar },
    { to: "/volunteers", label: "Volunteer Roster", icon: Users },
    { to: "/scanner", label: "Gate Scanner", icon: QrCode },
  ];

  return (
    <header className="bg-slate-800/90 border-b border-slate-700/60 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                FestOps
              </span>
              <span className="hidden sm:inline-block text-xs text-indigo-400 font-medium ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                Core Operations
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold">System Online & Secure</span>
          </div>
        </div>
      </div>
    </header>
  );
};
