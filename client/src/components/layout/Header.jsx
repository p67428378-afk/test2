import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 h-[64px] left-[260px] bg-surface border-b border-outline-variant flex justify-between items-center px-lg z-40">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search hives, logs, or reports..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-lg">
        <div className="hidden lg:flex items-center gap-sm text-on-surface-variant bg-surface-container-low px-md py-sm rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-primary-container">
            wb_sunny
          </span>
          <span className="font-mono-data text-mono-data">
            24°C | Hum 55% | Wind 8km/h
          </span>
          <span className="font-label-md text-[10px] ml-sm text-tertiary-container">
            (Optimal)
          </span>
        </div>
        <div className="flex items-center gap-md">
          <button className="relative p-2 text-on-surface-variant hover:text-primary transition-opacity cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-container rounded-full border-2 border-surface"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
