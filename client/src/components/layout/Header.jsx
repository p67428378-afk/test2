import React from "react";

export default function Header() {
  return (
    <header className="bg-surface/60 fixed top-0 right-0 w-[calc(100%-260px)] h-16 border-b border-white/10 backdrop-blur-md flex items-center justify-between px-8 z-40">
      {/* Search Bar on Left */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded-md pl-10 pr-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-on-surface-variant/50 text-sm"
            placeholder="Search OceanOS..."
            type="text"
          />
        </div>
      </div>

      {/* Trailing Icon Actions */}
      <div className="flex items-center gap-4 text-on-surface-variant">
        <button className="hover:text-primary transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full glow-cyan"></span>
        </button>
        <button className="hover:text-primary transition-colors">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_circle
          </span>
        </button>
      </div>
    </header>
  );
}
