import React from "react";
import PropTypes from "prop-types";
import { Bell, Search, Menu } from "lucide-react";

const Header = ({ title, onSearchChange, searchValue }) => {
  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-600 hover:text-slate-900">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        {onSearchChange && (
          <div className="relative w-64 max-w-xs hidden sm:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search animals..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150"
            />
          </div>
        )}

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors duration-150">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile Dropdown Trigger */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center font-bold text-sm">
            JD
          </div>
          <span className="text-sm font-medium text-slate-700 hidden md:inline">
            Jane Doe
          </span>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func,
  searchValue: PropTypes.string,
};

export default Header;
