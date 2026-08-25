import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { LogOut, Package, LayoutDashboard, History, User } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/items", label: "Items", icon: Package },
    { path: "/adjustments", label: "Adjustments", icon: History },
  ];

  return (
    <nav className="bg-white border-b border-[#e3e8f0] px-6 py-4 flex items-center justify-between w-full sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-[#2663eb] text-xl"
        >
          <Package className="h-6 w-6" />
          <span>InventoryPro</span>
        </Link>

        {currentUser && (
          <div className="flex gap-6 items-center text-[#707a8c] text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 py-1 px-2 rounded transition-colors ${
                    isActive
                      ? "text-[#2663eb] bg-[#eff6ff]"
                      : "hover:text-[#2663eb] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {currentUser ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-gray-100 p-1.5 rounded-full text-gray-600">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 leading-none">
                {currentUser.full_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <div className="text-xs text-gray-500">Not logged in</div>
      )}
    </nav>
  );
}
