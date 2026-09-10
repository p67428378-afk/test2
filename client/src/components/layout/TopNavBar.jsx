import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopNavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="font-bold text-lg text-slate-900">Quick CV</span>
        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
          ✓ Saved to Cloud
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="text-sm font-medium text-slate-700">
              {user.full_name || user.email}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-slate-600 hover:text-slate-900 font-medium"
        >
          Log Out
        </button>
        <button className="bg-indigo-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg shadow-sm hover:bg-indigo-700">
          Export PDF
        </button>
      </div>
    </header>
  );
}
