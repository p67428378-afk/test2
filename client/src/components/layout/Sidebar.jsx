import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  ShieldCheck,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/mobile", label: "Mobile Workflow", icon: Wallet },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#0F172A] flex flex-col py-container-margin px-cell-padding-x border-r border-outline-variant">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 bg-indigo-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <div className="flex flex-col">
          <span className="text-headline-sm font-headline-sm font-bold text-on-surface">
            ApexTreasury
          </span>
          <span className="text-label-md font-label-md text-on-surface-variant opacity-60">
            Enterprise Treasury
          </span>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                isActive
                  ? "text-primary-fixed bg-indigo-accent bg-opacity-10 border-l-[3px] border-indigo-accent font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors group"
          href="#"
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="font-label-md text-label-md">Executions</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors group"
          href="#"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="font-label-md text-label-md">Compliance</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors group"
          href="#"
        >
          <Settings className="w-5 h-5" />
          <span className="font-label-md text-label-md">Settings</span>
        </a>
      </nav>
      <div className="mt-auto border-t border-outline-variant pt-6 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant">
            <div className="w-full h-full bg-indigo-accent flex items-center justify-center text-white font-bold">
              SC
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-label-md font-label-md font-bold text-on-surface">
              Sarah Chen
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
              Treasury Manager
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
