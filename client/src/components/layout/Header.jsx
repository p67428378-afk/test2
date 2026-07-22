import React from "react";

const Header = ({
  isConnected = true,
  searchQuery = "",
  setSearchQuery = () => {},
}) => {
  return (
    <header className="bg-surface-dim fixed top-0 right-0 h-[64px] left-[260px] border-b border-outline-variant flex items-center justify-between px-margin-desktop w-full z-10 transition-colors duration-200">
      {/* Search */}
      <div className="relative w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
          search
        </span>
        <input
          className="w-full bg-surface-container-highest border border-outline-variant rounded-full py-[8px] pl-[36px] pr-md font-body-sm text-body-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          placeholder="Search tasks..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-md">
        <div
          className={`flex items-center gap-xs px-sm py-xs rounded-full ${isConnected ? "bg-secondary/10 border border-secondary/20" : "bg-error/10 border border-error/20"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${isConnected ? "bg-secondary shadow-[0_0_6px_rgba(78,222,163,0.8)]" : "bg-error shadow-[0_0_6px_rgba(255,180,171,0.8)]"}`}
          ></div>
          <span
            className={`font-label-sm text-label-sm tracking-wide ${isConnected ? "text-secondary" : "text-error"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex items-center gap-sm text-on-surface-variant">
          <button className="relative p-xs rounded-full hover:bg-surface-variant hover:text-primary transition-colors scale-95 active:scale-90">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-4 h-4 bg-error text-on-error rounded-full flex items-center justify-center font-label-sm text-[10px]">
              2
            </span>
          </button>
          <button className="p-xs rounded-full hover:bg-surface-variant hover:text-primary transition-colors scale-95 active:scale-90">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
