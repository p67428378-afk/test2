import React from "react";
import { LayoutDashboard } from "lucide-react";

export default function Header() {
  return (
    <nav
      aria-label="Main Navigation"
      className="w-full sticky top-0 z-50 bg-white border-b border-outline-variant/30 shadow-sm"
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto h-[64px]">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
              DG
            </div>
            <span className="font-bold text-xl text-primary tracking-tight">
              Dollar General
            </span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant/50 hidden md:block"></div>
          <span className="hidden md:inline text-sm font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
            Small Town Value Cluster
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">
              Assortment Advisor
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-xs">
              AM
            </div>
            <span className="font-medium hidden sm:inline">
              Category Manager
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
