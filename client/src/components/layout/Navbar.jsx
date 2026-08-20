import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { authService } from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="bg-white border-b border-[#e3e8f0] flex items-center justify-between px-8 py-4 w-full shrink-0">
      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="font-bold text-[#2663eb] text-lg flex items-center gap-2"
        >
          <ShieldCheck className="w-6 h-6" />
          WarrantyTracker
        </Link>
        <div className="flex gap-6 items-center text-[#707a8c] text-sm font-medium">
          <Link to="/" className="hover:text-[#2663eb] transition-colors">
            Dashboard
          </Link>
          <Link
            to="/register-product"
            className="hover:text-[#2663eb] transition-colors"
          >
            Register Product
          </Link>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <button
          className="text-[#707a8c] hover:text-[#2663eb] transition-colors relative p-1"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={handleLogout}
          className="text-[#707a8c] hover:text-red-600 transition-colors flex items-center gap-1 text-sm font-medium"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
        <div className="bg-[#2663eb] flex items-center justify-center rounded-full w-8 h-8 shrink-0">
          <p className="font-bold text-xs text-white">VJ</p>
        </div>
      </div>
    </div>
  );
}
