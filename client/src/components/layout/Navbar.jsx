import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Shield, Car, Radio, User } from "lucide-react";

export default function Navbar({ activeRoute }) {
  const location = useLocation();
  const currentPath = activeRoute || location.pathname;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-blue-900 tracking-tight">
            FleetHub Enterprise
          </h1>
          <p className="text-[11px] text-slate-500">
            Vehicle Category & Fleet Management
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-6 text-sm font-semibold">
        <Link
          to="/"
          className={`py-1 transition flex items-center gap-1.5 ${
            currentPath === "/" || currentPath === "/search"
              ? "text-blue-700 border-b-2 border-blue-700 font-bold"
              : "text-slate-600 hover:text-blue-700"
          }`}
        >
          Search Map
        </Link>
        <Link
          to="/categories"
          className={`py-1 transition flex items-center gap-1.5 ${
            currentPath.startsWith("/categories")
              ? "text-blue-700 border-b-2 border-blue-700 font-bold"
              : "text-slate-600 hover:text-blue-700"
          }`}
        >
          <Car className="w-4 h-4 text-blue-600" />
          Vehicle Categories
        </Link>
        <Link
          to="/monitor"
          className={`py-1 transition flex items-center gap-1.5 ${
            currentPath === "/monitor"
              ? "text-blue-700 border-b-2 border-blue-700 font-bold"
              : "text-slate-600 hover:text-blue-700"
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          Live Monitor
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="p-2 text-slate-400 hover:text-slate-600 transition relative rounded-lg hover:bg-slate-100"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
        </button>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
            Admin User
          </span>
        </div>
      </div>
    </header>
  );
}
