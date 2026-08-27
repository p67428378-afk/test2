import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Radio, Bell } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Discover", path: "/" },
    { name: "Trending", path: "/?tab=trending" },
    { name: "Categories", path: "/?tab=categories" },
    { name: "Subscriptions", path: "/?tab=subscriptions" },
    { name: "Library", path: "/?tab=library" },
  ];

  return (
    <header className="bg-white border-b border-[#e3e8f0] sticky top-0 z-40 px-4 md:px-8 py-3 w-full shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-[#2663eb] text-lg hover:opacity-90 transition-opacity"
          >
            <span className="text-xl">🎙️</span>
            <span>Podcast Hub</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[#707a8c]">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path && !location.search;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors py-1 ${
                    isActive
                      ? "text-[#2663eb] font-semibold border-b-2 border-[#2663eb]"
                      : "hover:text-[#171c29]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right action icons & Avatar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="p-2 text-[#707a8c] hover:text-[#171c29] hover:bg-slate-100 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
          <div
            className="bg-[#2663eb] flex items-center justify-center rounded-full size-8 text-white font-bold text-xs shadow-sm cursor-pointer select-none"
            title="User Profile: Podcast Listener"
          >
            PL
          </div>
        </div>
      </div>
    </header>
  );
}
