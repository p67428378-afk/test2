import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Compass, Map, User } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/animals", label: "Animals", icon: Compass },
    { to: "/map", label: "Interactive Map", icon: Map },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
          Z
        </div>
        <div>
          <h1 className="font-bold text-white text-lg leading-none">
            ZooVisitor
          </h1>
          <span className="text-xs text-slate-500">Explorer App</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-slate-800 hover:text-white text-slate-400"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors duration-150 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Jane Doe</p>
            <p className="text-xs text-slate-500 truncate">
              jane.doe@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
