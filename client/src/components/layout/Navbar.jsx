import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  LogOut,
  User,
  ShieldAlert,
} from "lucide-react";
import { authService } from "../../services/api";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Patients", path: "/patients", icon: Users },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "Medical Records", path: "/medical-records", icon: FileText },
    { name: "Billing", path: "/invoices", icon: CreditCard },
  ];

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "doctor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "nurse":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "receptionist":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <header className="bg-white border-b border-[#e0e8f0] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-label="hospital">
              🏥
            </span>
            <span className="font-bold text-lg text-[#1485b8] tracking-tight">
              MedCare HMS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#e8f4f8] text-[#1485b8]"
                        : "text-[#6b7a8f] hover:bg-slate-50 hover:text-[#171f2e]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Section: User Profile & Logout */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-[#171f2e]">
                    {user.full_name || "Staff Member"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${getRoleColor(
                      user.role,
                    )}`}
                  >
                    {user.role || "Staff"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-[#6b7a8f] hover:text-[#db2727] hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-medium">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#1485b8] text-white text-sm font-medium rounded-md hover:bg-[#0f6e99] transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
      {/* Mobile nav bar */}
      <div className="md:hidden flex overflow-x-auto border-t border-[#e0e8f0] px-2 py-1 bg-slate-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-[#1485b8] text-white"
                    : "text-[#6b7a8f] hover:bg-slate-200"
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </header>
  );
}
