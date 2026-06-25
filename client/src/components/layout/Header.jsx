import React from "react";

export default function Header() {
  return (
    <header className="bg-surface fixed top-0 right-0 h-16 left-[280px] border-b border-outline-variant flex items-center justify-between px-6 w-full z-40">
      {/* Title/Breadcrumb area */}
      <div className="flex items-center gap-4 flex-1">
        <h2 className="font-headline-md text-headline-md text-on-surface truncate">
          Semi-Urban/Rural Branch Cluster Decision Support
        </h2>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-6 shrink-0 pr-[280px]">
        {/* Search */}
        <div className="relative w-64 hidden lg:block group">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-fixed-dim transition-colors"
            style={{ fontSize: "20px" }}
          >
            search
          </span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim transition-all"
            placeholder="Search products..."
            type="text"
          />
        </div>
        {/* Notifications */}
        <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-surface-container-low">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-surface">
            2
          </span>
        </button>
        {/* Secondary Action (Account Settings hint) */}
        <button
          className="hidden md:flex items-center justify-center p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-surface-container-low"
          title="Account Settings"
        >
          <span className="material-symbols-outlined">
            settings_account_box
          </span>
        </button>
      </div>
    </header>
  );
}
