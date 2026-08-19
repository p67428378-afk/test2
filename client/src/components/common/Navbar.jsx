import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Wifi, Bell } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Maintenance Logs", path: "/logs" },
  ];

  return (
    <header className="bg-white border-b border-[#e3e8f0] px-8 py-4 w-full sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#2663eb] font-bold text-lg hover:opacity-90 transition-opacity"
          >
            <Wifi className="w-6 h-6" />
            <span>WiFi Tracker</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    isActive
                      ? "text-[#2663eb] font-semibold border-b-2 border-[#2663eb] pb-1"
                      : "text-[#707a8c] hover:text-[#171c29]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-[#707a8c] hover:text-[#171c29] rounded-full hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2663eb] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              ADMIN
            </div>
            <span className="text-xs text-[#707a8c] hidden md:inline font-medium">
              Network Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
