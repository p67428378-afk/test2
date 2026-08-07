import React from "react";
import { Bell, Search, Menu } from "lucide-react";

export default function Header({
  seller,
  onMenuClick,
  onSearchChange,
  searchValue,
}) {
  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-260px)] h-16 bg-surface text-primary font-body-lg text-body-lg flex justify-between items-center px-8 shadow-sm z-40 border-b border-outline-variant">
      <div className="flex items-center gap-4 w-full max-w-md">
        <button
          aria-label="Menu"
          onClick={onMenuClick}
          className="md:hidden text-on-surface-variant p-2 hover:bg-surface-container-low rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full focus-within:ring-2 focus-within:ring-primary rounded-lg hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-5 w-5" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-body-md transition-colors text-on-surface"
            placeholder="Search products..."
            type="text"
            value={searchValue || ""}
            onChange={onSearchChange}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-outline-variant pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface">
              {seller?.store_name || "Vendor"}
            </p>
            <p className="text-xs text-on-surface-variant">
              {seller?.email || ""}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer flex items-center justify-center bg-primary-container text-on-primary-container font-bold">
            {seller?.store_name
              ? seller.store_name.charAt(0).toUpperCase()
              : "V"}
          </div>
        </div>
      </div>
    </header>
  );
}
