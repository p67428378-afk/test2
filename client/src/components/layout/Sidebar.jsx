import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  LayoutDashboard,
  PlusSquare,
  CheckSquare,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { authService } from "../../services/api";

export default function Sidebar({ onQuickReport }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/report", label: "Report Item", icon: PlusSquare },
    { path: "/browse", label: "Browse Found", icon: Search },
  ];

  if (user?.role === "admin") {
    navItems.push({ path: "/admin", label: "Admin Claims", icon: ShieldAlert });
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#0F172A] border-r border-slate-800 shadow-none z-20 flex flex-col py-6">
      {/* Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <Search className="text-[#6366F1] w-8 h-8" />
        <div>
          <h1 className="font-bold text-xl text-white">ReclaimAI</h1>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mb-6">
        <button
          onClick={onQuickReport}
          className="w-full bg-[#6366F1] text-white rounded-lg py-2.5 font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Quick Report
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 border-l-4 transition-all duration-200 ease-in-out ${
                active
                  ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1] font-medium"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="px-4 mt-auto space-y-3">
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
              <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-semibold text-white truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-slate-400 capitalize truncate">
                {user.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
