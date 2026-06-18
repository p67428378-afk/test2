import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Send,
  History,
  ShieldAlert,
  Settings,
  Plus,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/initiate", label: "Initiate Payment", icon: Send },
    { path: "/history", label: "Payments History", icon: History },
    { path: "/risk-limits", label: "Risk & Limits", icon: ShieldAlert },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-[#0d1c2d] fixed left-0 top-0 h-screen w-[260px] border-r border-outline-variant/20 flex flex-col py-6 px-4 z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
          <span className="material-symbols-outlined text-indigo-400">
            account_balance
          </span>
        </div>
        <div>
          <h1 className="font-bold text-primary leading-tight text-lg">
            XBorder Treasury
          </h1>
          <span className="text-on-surface-variant uppercase tracking-widest text-[10px] font-bold">
            Global Liquidity
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                  isActive
                    ? "text-primary font-bold border-r-2 border-primary bg-surface-variant/20"
                    : "text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* CTA & Footer */}
      <div className="mt-auto space-y-4">
        <button
          onClick={() => navigate("/initiate")}
          className="w-full py-3 px-4 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          <Plus className="w-4 h-4" />
          New Transaction
        </button>
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-container/50 border border-outline-variant/10">
          <img
            className="w-10 h-10 rounded-full object-cover border border-outline-variant/30"
            alt="Alex Mercer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfuBC-CaMMZpUFwrE68VSROsgi-mpwKWOabVbLK6mYhHuPndaEoLhZ9O73EAEHrmtVITzUiv-CTfNWeMqy8ygT__nHQGLs4mQdj_GCFHP3VQ2W0afA11716PKKnwIQP6JEEZ91ildpfi1kzEKFk8hl0QNkJzWMGL4z8wn61AAJiOPUFfaDOUQEL4uobSiObXfJa6UFxpzk-5s-IUuYsTvJ7A2dhobUXVAFKNohhY8w5HDvi0hZ674pURuj8lYK1FxVH57mbkfLCOY"
          />
          <div className="flex flex-col">
            <span className="text-sm text-on-surface font-medium">
              Alex Mercer
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              Treasury Manager
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
