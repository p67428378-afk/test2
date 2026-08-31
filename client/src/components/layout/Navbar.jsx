import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Activity,
  Layers,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { authApi } from "../../services/api";

export default function Navbar() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Default to the seeded student user info for instant display
      setCurrentUser({
        full_name: "1st Year MBBS Student",
        email: "test@example.com",
        role: "student",
      });
    }
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/", icon: BookOpen },
    { name: "Anatomy Viewer", path: "/anatomy", icon: Layers },
    { name: "Digital Animations", path: "/animation", icon: Activity },
  ];

  const handleLogout = () => {
    authApi.logout();
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-[#dee3ed] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#1466bf] flex items-center justify-center text-white shadow-sm group-hover:bg-[#0e4b8f] transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-[#171f2e] tracking-tight block leading-tight">
                  MBBS Digital Learning
                </span>
                <span className="text-[11px] font-medium text-[#1466bf] tracking-wide uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#149e52]" /> 1st Year
                  Medical Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-[#1466bf] font-semibold"
                      : "text-[#6b758a] hover:text-[#171f2e] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Test Account Notice */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-[#171f2e]">
                {currentUser?.full_name || "1st Year MBBS Student"}
              </span>
              <span className="text-[11px] text-[#6b758a]">
                {currentUser?.email || "test@example.com"}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1466bf] font-bold text-sm">
              <User className="w-4 h-4" />
            </div>

            <button
              onClick={handleLogout}
              title="Reset Session"
              className="p-2 text-[#6b758a] hover:text-red-600 rounded-lg hover:bg-red-50 transition"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
