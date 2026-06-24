import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 h-16 w-[calc(100%-260px)] bg-surface border-b border-outline-variant flex items-center justify-between px-6 z-10">
      <h2 className="font-title-sm text-title-sm font-semibold text-on-surface">
        Semi-Urban/Rural Branch Cluster Decision-Support
      </h2>
      <div className="flex items-center gap-6">
        <span className="font-data-mono text-data-mono text-on-surface-variant">
          January 9, 2026
        </span>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
        </div>
      </div>
    </header>
  );
}
