import React from "react";
import { NavLink } from "react-router-dom";
import { CreditCard, Bell } from "lucide-react";

export default function Navbar() {
  const activeClass =
    "text-[#2663eb] font-semibold border-b-2 border-[#2663eb] pb-1";
  const inactiveClass =
    "text-[#707a8c] hover:text-[#171c29] transition-colors pb-1";

  return (
    <nav className="bg-white border-b border-[#e3e8f0] px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-[#2663eb]" />
          <span className="font-bold text-lg text-[#2663eb]">
            ExpenseTracker
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Expenses
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Reports
          </NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="text-[#707a8c] hover:text-[#171c29] p-1 rounded-full hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
        <div className="bg-[#2663eb] text-white font-bold text-xs w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
          AJ
        </div>
      </div>
    </nav>
  );
}
