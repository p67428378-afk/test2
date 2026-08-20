import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Shield, Users } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-[#e3e8f0] px-6 py-4 w-full flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#2663eb] font-bold text-xl no-underline"
        >
          <Users className="w-6 h-6" />
          <span>Q-Express Digital Queue</span>
        </Link>
        <div className="flex items-center gap-6 font-medium text-sm text-[#707a8c]">
          <Link
            to="/join"
            className={`transition-colors hover:text-[#2663eb] ${
              isActive("/join") || isActive("/")
                ? "text-[#2663eb] font-semibold"
                : ""
            }`}
          >
            Join Line
          </Link>
          <Link
            to="/tracker/check"
            className={`transition-colors hover:text-[#2663eb] ${
              isActive("/tracker/check") ||
              location.pathname.startsWith("/tracker")
                ? "text-[#2663eb] font-semibold"
                : ""
            }`}
          >
            Check Status
          </Link>
          <Link
            to="/agent/dashboard"
            className={`transition-colors hover:text-[#2663eb] ${
              isActive("/agent/dashboard") ? "text-[#2663eb] font-semibold" : ""
            }`}
          >
            Agent Portal
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm font-medium text-[#171c29]">
        <button
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-gray-100 text-[#707a8c] transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 bg-[#f2f5fa] px-3 py-1.5 rounded-lg border border-[#e3e8f0]">
          <Shield className="w-4 h-4 text-[#2663eb]" />
          <span>Service Desk</span>
        </div>
      </div>
    </nav>
  );
}
