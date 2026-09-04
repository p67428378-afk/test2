import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  BarChart2,
  GraduationCap,
  User,
} from "lucide-react";

const Navbar = () => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Subjects & Topics", path: "/subjects", icon: BookOpen },
    { name: "Study Schedule", path: "/schedules", icon: Calendar },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className="flex items-center space-x-2 text-indigo-900 font-bold text-xl"
            >
              <GraduationCap className="h-7 w-7 text-indigo-600" />
              <span>StudyPlanner</span>
            </NavLink>
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-700 text-sm font-medium">
              <User className="h-4 w-4 text-slate-500" />
              <span>Student Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50 px-2 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-md text-xs font-medium ${
                  isActive ? "text-indigo-700 font-semibold" : "text-slate-600"
                }`
              }
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </header>
  );
};

export default Navbar;
