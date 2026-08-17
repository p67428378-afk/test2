import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  Search,
  History,
} from "lucide-react";

export const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Report Item",
      path: "/report",
      icon: PlusCircle,
    },
  ];

  if (isAdmin) {
    navItems.push({
      label: "Admin Verification",
      path: "/admin/claims",
      icon: ShieldCheck,
    });
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          D
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight">
            Dairy Lost & Found
          </h1>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Role:{" "}
              <strong className="text-indigo-400 uppercase">{user.role}</strong>
            </span>
            <span
              className="w-2 h-2 rounded-full bg-emerald-500"
              title="Active"
            ></span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
