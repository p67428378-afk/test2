import React from "react";

const Header = ({ searchVal = "", onSearchChange = () => {} }) => {
  return (
    <header className="h-[64px] bg-surface border-b border-outline-variant flex justify-between items-center px-gutter w-full shrink-0 z-10">
      <div className="flex-1 flex items-center max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
            placeholder="Search catalog..."
            type="text"
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-sm">
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-full relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 ease-in-out rounded-full">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
