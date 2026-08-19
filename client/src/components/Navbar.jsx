import React from "react";
import { NavLink } from "react-router-dom";
import { Zap, Bell } from "lucide-react";

export default function Navbar() {
  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-[#1f40b0] ${
      isActive
        ? "text-[#1f40b0] font-bold border-b-2 border-[#1f40b0] pb-1"
        : "text-[#707a8c]"
    }`;

  return (
    <nav className="bg-white border-b border-[#e3e8f0] px-6 py-4 flex items-center justify-between w-full shadow-sm">
      <div className="flex items-center gap-8">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-[#1f40b0] font-bold text-lg"
        >
          <Zap className="w-5 h-5 fill-current text-[#1f40b0]" />
          <span>EB Tracker</span>
        </NavLink>
        <div className="flex items-center gap-6">
          <NavLink to="/" end className={linkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/tasks/new" className={linkClasses}>
            Record Task
          </NavLink>
          <NavLink to="/analytics" className={linkClasses}>
            Cost Analytics
          </NavLink>
          <NavLink to="/technicians" className={linkClasses}>
            Technicians
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="p-1.5 text-[#707a8c] hover:text-[#171c29] rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-[#1f40b0] text-white font-bold text-xs w-8 h-8 rounded-full flex items-center justify-center">
            FM
          </div>
          <span className="text-sm font-medium text-[#171c29] hidden sm:inline">
            Facility Admin
          </span>
        </div>
      </div>
    </nav>
  );
}
