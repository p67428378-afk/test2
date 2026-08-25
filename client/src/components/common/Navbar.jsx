import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Wallet, Bell } from "lucide-react";

export default function Navbar() {
  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-[#2663eb] font-semibold border-b-2 border-[#2663eb] pb-1"
        : "text-[#707a8c] hover:text-[#171c29]"
    }`;

  return (
    <nav className="bg-white border-b border-[#e3e8f0] px-6 md:px-8 py-4 sticky top-0 z-30 shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand and Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#2663eb] font-bold text-xl tracking-tight"
          >
            <div className="bg-[#2663eb] text-white p-1.5 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span>ExpenseFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClasses} end>
              Dashboard
            </NavLink>
            <NavLink to="/expenses" className={navLinkClasses}>
              Expenses
            </NavLink>
            <NavLink to="/budgets" className={navLinkClasses}>
              Budgets & Analytics
            </NavLink>
          </div>
        </div>

        {/* User / Notification Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="p-2 text-[#707a8c] hover:text-[#171c29] hover:bg-[#f2f5fa] rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#db2626] rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#e3e8f0]">
            <div className="bg-[#2663eb] text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
              VA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#171c29] leading-tight">
                Valued User
              </p>
              <p className="text-[11px] text-[#707a8c] leading-tight">
                Personal Plan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around pt-3 mt-3 border-t border-[#e3e8f0]">
        <NavLink to="/" className={navLinkClasses} end>
          Dashboard
        </NavLink>
        <NavLink to="/expenses" className={navLinkClasses}>
          Expenses
        </NavLink>
        <NavLink to="/budgets" className={navLinkClasses}>
          Budgets & Analytics
        </NavLink>
      </div>
    </nav>
  );
}
