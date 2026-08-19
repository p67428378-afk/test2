import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  User,
  LogOut,
  FileText,
  CheckSquare,
  Clock,
  Users,
} from "lucide-react";

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Conferences",
      path: "/organizer",
      icon: Calendar,
      role: "ORGANIZER",
    },
    {
      label: "Submit Proposal",
      path: "/speaker",
      icon: FileText,
      role: "SPEAKER",
    },
    {
      label: "Review Portal",
      path: "/reviewer",
      icon: CheckSquare,
      role: "REVIEWER",
    },
    { label: "Public Agenda", path: "/agenda", icon: Clock },
    {
      label: "Attendance Tracker",
      path: "/attendance",
      icon: Users,
      role: "ORGANIZER",
    },
  ];

  return (
    <header className="bg-white border-b border-[#e3e8f0] px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-[#2663eb] font-bold text-xl flex items-center gap-2"
          >
            <Calendar className="w-6 h-6 text-[#2663eb]" />
            <span>ConfManage</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#707a8c]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? "text-[#2663eb] font-semibold"
                      : "hover:text-[#171c29]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & auth controls */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-[#171c29]">
                  {currentUser.full_name || currentUser.email}
                </span>
                <span className="text-xs text-[#707a8c] font-mono uppercase bg-gray-100 px-1.5 py-0.5 rounded">
                  {currentUser.role || "ATTENDEE"}
                </span>
              </div>
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2663eb] text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
