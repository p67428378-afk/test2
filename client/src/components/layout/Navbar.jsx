import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  CheckSquare,
  DollarSign,
  Users,
  LogOut,
  Bell,
  User as UserIcon,
} from "lucide-react";
import { authAPI } from "../../services/api";

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authAPI.logout();
    if (onLogout) onLogout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: CheckSquare },
    { name: "Cost Analytics", path: "/costs", icon: DollarSign },
    { name: "Household Members", path: "/members", icon: Users },
  ];

  return (
    <header className="bg-white border-b border-[#e3e8f0] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg text-[#2663eb]">
              <Home className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg text-[#171c29] tracking-tight">
              🏡 HomeKeep
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-[#2663eb]"
                        : "text-[#707a8c] hover:bg-gray-100 hover:text-[#171c29]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Section: User & Logout */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-[#707a8c] hover:text-[#171c29] rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-[#f7fafc] px-3 py-1.5 rounded-full border border-[#e3e8f0]">
                  <UserIcon className="w-4 h-4 text-[#2663eb]" />
                  <span className="text-xs font-semibold text-[#171c29]">
                    {currentUser.full_name || currentUser.email}
                  </span>
                  <span className="text-[10px] bg-blue-100 text-[#2663eb] px-1.5 py-0.5 rounded capitalize">
                    {currentUser.role || "member"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-[#707a8c] hover:text-[#db2626] rounded-lg hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="text-sm font-medium text-[#2663eb] hover:underline"
              >
                Log in
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
