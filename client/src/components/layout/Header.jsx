import React from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/memberships":
        return "Memberships";
      case "/visits":
        return "Visits";
      case "/settings":
        return "Settings";
      default:
        return "FitValue";
    }
  };

  return (
    <header className="fixed top-0 right-0 h-[64px] left-[260px] bg-surface/80 backdrop-blur-md z-10 flex items-center justify-between px-gutter w-full shadow-[0_1px_0_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-md">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          {getTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-lg">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className="bg-surface-container-high border-none rounded-full py-2 pl-[36px] pr-sm text-body-sm font-body-sm text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary w-64 transition-all"
            placeholder="Search data..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-sm">
          <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-70 rounded-full hover:bg-surface-container-highest">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full font-label-sm text-[10px] flex items-center justify-center text-on-error font-bold border border-surface">
              2
            </span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-70 rounded-full hover:bg-surface-container-highest">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </div>
    </header>
  );
}
