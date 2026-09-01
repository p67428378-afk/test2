import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Patients", path: "/patients", icon: Users },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "EMR Records", path: "/emr", icon: FileText },
    { name: "Billing & Invoices", path: "/billing", icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-lg">
      <div className="p-4 border-b border-slate-800">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Main Navigation
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>System Online • HIPAA Compliant</span>
        </div>
      </div>
    </aside>
  );
}
