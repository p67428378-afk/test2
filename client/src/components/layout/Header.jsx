import React from "react";

export default function Header({
  onMenuToggle,
  totalCollection = 12450,
  availableNow = 9820,
}) {
  return (
    <header className="sticky top-0 h-header-height bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline flex justify-between items-center px-gutter z-10 w-full">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
          onClick={onMenuToggle}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        {/* Breadcrumbs */}
        <nav className="hidden sm:flex text-label-md font-label-md text-on-surface-variant items-center gap-2">
          <span>Catalog</span>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="text-primary font-bold">Search</span>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        {/* Stats */}
        <div className="hidden lg:flex items-center gap-6 text-body-md font-body-md">
          <div className="flex flex-col items-end">
            <span className="text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
              Total Collection
            </span>
            <span className="font-bold text-on-surface">
              {totalCollection.toLocaleString()}
            </span>
          </div>
          <div className="h-8 w-px bg-outline-variant"></div>
          <div className="flex flex-col items-end">
            <span className="text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
              Available Now
            </span>
            <span className="font-bold text-secondary">
              {availableNow.toLocaleString()}
            </span>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest rounded-full transition-colors active:opacity-80">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest rounded-full transition-colors active:opacity-80">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </div>
    </header>
  );
}
