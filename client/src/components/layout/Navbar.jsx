import React from "react";
import { NavLink } from "react-router-dom";
import {
  Landmark,
  Compass,
  Package,
  Users,
  FlaskConical,
  BookOpen,
  Bell,
  User,
} from "lucide-react";

export default function Navbar() {
  const navItems = [
    { to: "/", label: "Dashboard", icon: Landmark },
    { to: "/sites", label: "Sites & GPS Map", icon: Compass },
    { to: "/artifacts", label: "Artifact Catalog", icon: Package },
    { to: "/teams", label: "Teams", icon: Users },
    { to: "/lab-analysis", label: "Lab Analysis", icon: FlaskConical },
    { to: "/publications", label: "Publications", icon: BookOpen },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-amber-800 tracking-tight flex items-center gap-2">
                🏛️ ArchExcav
              </span>
            </NavLink>
            <nav className="hidden md:flex space-x-1 lg:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-amber-50 text-amber-800 border-b-2 border-amber-800 font-semibold"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button
              title="Notifications"
              className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-full relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-800 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 border-l border-stone-200 pl-4">
              <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-stone-900">Dr. Jane Doe</p>
                <p className="text-stone-500">Lead Archaeologist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden border-t border-stone-200 px-2 py-2 flex overflow-x-auto space-x-1 bg-stone-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
                isActive
                  ? "bg-amber-800 text-white"
                  : "text-stone-700 hover:bg-stone-200"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
