import React from "react";

export default function HeaderBar() {
  return (
    <header className="h-[64px] w-full top-0 sticky bg-surface-container border-b border-outline-variant flex items-center justify-between px-margin-page z-50 flex-shrink-0">
      <div className="flex items-center gap-lg">
        <div className="flex items-center gap-sm">
          <span className="font-headline-sm text-primary font-bold text-xl">
            Cluster Assortment Advisor
          </span>
          <span className="text-on-surface-variant font-body-sm text-sm hidden sm:inline">
            — Snacks (Small Town Value Cluster)
          </span>
        </div>
        {/* Navigation (Active State) */}
        <div className="hidden md:flex items-center h-full pt-1">
          <a
            className="text-primary font-bold border-b-2 border-primary pb-1 px-4 cursor-pointer hover:bg-surface-container-high transition-colors duration-200"
            href="#"
          >
            STV-CLUSTER-01
          </a>
        </div>
      </div>
      <div className="flex items-center gap-lg">
        <div className="hidden md:flex flex-col items-end">
          <span className="font-label-sm text-primary text-xs font-semibold">
            Small Town Value Cluster
          </span>
          <span className="font-body-sm text-on-surface-variant text-xs">
            Last sync: 10:42 AM
          </span>
        </div>
        <div className="flex items-center gap-sm">
          <div className="text-right hidden sm:block">
            <div className="font-label-md text-on-surface text-xs font-semibold">
              Category Manager (USR-CM-882)
            </div>
            <div className="font-body-sm text-on-surface-variant text-xs">
              Updated: May 18, 2026
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-outline-variant bg-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
            CM
          </div>
        </div>
      </div>
    </header>
  );
}
