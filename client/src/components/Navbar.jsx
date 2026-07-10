import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { Shield, LogOut, User, ClipboardList, KeyRound } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (!user.token) return null;

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-indigo-400" />
            <span className="font-bold text-lg tracking-wider">PVMS</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-300 text-sm bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <User className="h-4 w-4 text-indigo-400" />
              <span className="capitalize font-medium">{user.role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
