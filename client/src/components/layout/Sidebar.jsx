import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  Globe,
  Calendar,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { authService } from "../../services/api";

export default function Sidebar({ onNewMissionClick }) {
  const location = useLocation();
  const user = authService.getCurrentUser();

  const menuItems = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard },
    { path: "/components", name: "Components", icon: List },
    { path: "/missions", name: "Missions", icon: Globe },
    { path: "/maintenance", name: "Maintenance", icon: Calendar },
  ];

  return (
    <nav className="bg-[#1b2120] fixed left-0 top-0 h-screen w-[280px] border-r border-[#3d4947] flex flex-col py-6 z-50">
      <div className="px-6 mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#6bd8cb] tracking-tight">
          AstroTrack
        </h1>
        <p className="text-xs text-[#bcc9c6] uppercase tracking-wider font-mono">
          Mission Control
        </p>
      </div>

      {user && (user.role === "Engineer" || user.role === "Admin") && (
        <button
          onClick={onNewMissionClick}
          className="mx-6 mb-8 bg-[#6bd8cb] hover:bg-[#89f5e7] text-[#003732] font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors glow-effect"
        >
          <Plus className="w-4 h-4" />
          New Mission
        </button>
      )}

      <ul className="flex-1 flex flex-col gap-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-all ${
                  isActive
                    ? "text-[#6bd8cb] border-l-4 border-[#6bd8cb] bg-[#6bd8cb]/10"
                    : "text-[#bcc9c6] hover:bg-[#303635] hover:text-[#dee4e1]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-4 mt-auto flex flex-col gap-2">
        {user ? (
          <div className="flex items-center justify-between p-3 bg-[#171d1c] rounded-lg border border-[#3d4947]">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[#dee4e1] truncate">
                {user.full_name}
              </span>
              <span className="text-xs text-[#bcc9c6] truncate">
                {user.role}
              </span>
            </div>
            <button
              onClick={() => {
                authService.logout();
                window.location.reload();
              }}
              className="text-[#bcc9c6] hover:text-[#ffb4ab] p-1 rounded transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#29a195] hover:bg-[#6bd8cb] text-[#00302b] font-semibold rounded-lg transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
