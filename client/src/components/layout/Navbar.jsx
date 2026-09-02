import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Landmark,
  Compass,
  Package,
  Users,
  FlaskConical,
  BookOpen,
  Box,
  RefreshCw,
  QrCode,
  ScanEye,
  Bell,
  User,
} from "lucide-react";
import OfflineSyncBadge from "./OfflineSyncBadge";

export default function Navbar() {
  const navItems = [
    { to: "/", label: "Dashboard", icon: Landmark },
    { to: "/sites", label: "Sites & Map", icon: Compass },
    { to: "/artifacts", label: "Artifacts", icon: Package },
    { to: "/trench-3d", label: "3D Trench", icon: Box },
    { to: "/sync-center", label: "PWA Sync", icon: RefreshCw },
    { to: "/custody-storage", label: "QR Custody", icon: QrCode },
    { to: "/ml-classification", label: "ML Classify", icon: ScanEye },
    { to: "/teams", label: "Teams", icon: Users },
    { to: "/lab-analysis", label: "Lab", icon: FlaskConical },
    { to: "/publications", label: "Publications", icon: BookOpen },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <NavLink to="/" className="flex items-center space-x-2">
              <span className="text-xl font-extrabold text-amber-800 tracking-tight flex items-center gap-1.5">
                🏛️ ArchExcav
              </span>
            </NavLink>
            <nav className="hidden xl:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-amber-50 text-amber-800 border-b-2 border-amber-800 font-bold"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <OfflineSyncBadge />
            <Link
              to="/custody-storage"
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded text-xs font-semibold shadow-sm transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </Link>
            <button
              title="Notifications"
              className="p-1.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-full relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-800 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 border-l border-stone-200 pl-3">
              <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-stone-900 leading-none">
                  Dr. Jane Doe
                </p>
                <p className="text-stone-500 text-[10px]">Lead Archaeologist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Scrollable nav for tablet/mobile */}
      <div className="xl:hidden border-t border-stone-200 px-2 py-1.5 flex overflow-x-auto space-x-1 bg-stone-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap flex items-center space-x-1 ${
                isActive
                  ? "bg-amber-800 text-white"
                  : "text-stone-700 hover:bg-stone-200"
              }`
            }
          >
            <item.icon className="w-3 h-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </header>
  );
}
