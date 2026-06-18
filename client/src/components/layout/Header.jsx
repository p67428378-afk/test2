import React from "react";
import { Search, Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="h-[64px] bg-surface-container border-b border-outline-variant flex items-center justify-between px-gutter shrink-0">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-md focus:outline-none focus:ring-2 focus:ring-indigo-accent focus:border-transparent transition-all"
            placeholder="Search rules, accounts..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-[10px] text-on-error flex items-center justify-center rounded-full font-bold">
            2
          </span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
