import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  DollarSign,
  LogOut,
  BookMarked,
} from "lucide-react";
import { authService } from "../services/api";

export default function Sidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const isLibrarian = user?.role === "librarian";

  const menuItems = isLibrarian
    ? [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/catalog", label: "Book Catalog", icon: BookOpen },
      ]
    : [{ path: "/portal", label: "Member Portal", icon: BookMarked }];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-emerald-500" />
        <div>
          <h1 className="font-bold text-lg text-slate-100 leading-none">
            LibMax
          </h1>
          <span className="text-xs text-slate-400">Management System</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user?.full_name || "User"}
            </p>
            <p className="text-xs text-slate-400 capitalize truncate">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
