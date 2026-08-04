import React from "react";

export default function TopNavBar({
  clusterName = "Small Town Value Cluster (1,240 Stores)",
  categoryName = "Snacks",
}) {
  return (
    <header className="bg-background dark:bg-background border-b border-outline-variant dark:border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin py-density-compact max-w-container-max-width mx-auto">
        <div className="flex items-center gap-6">
          {/* Brand Logo */}
          <div className="text-title-sm font-title-sm font-black text-primary-container dark:text-primary-container uppercase tracking-widest flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              storefront
            </span>
            Assortment Advisor
          </div>
          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 h-full">
            <a
              className="text-primary-container border-b-2 border-primary-container pb-1 font-title-sm text-title-sm cursor-pointer"
              href="#dashboard"
            >
              Dashboard
            </a>
            <a
              className="text-on-surface-variant hover:bg-surface-variant transition-colors py-1 px-2 rounded cursor-pointer font-title-sm text-title-sm"
              href="#scenarios"
            >
              Scenarios
            </a>
            <a
              className="text-on-surface-variant hover:bg-surface-variant transition-colors py-1 px-2 rounded cursor-pointer font-title-sm text-title-sm"
              href="#performance"
            >
              Performance
            </a>
            <a
              className="text-on-surface-variant hover:bg-surface-variant transition-colors py-1 px-2 rounded cursor-pointer font-title-sm text-title-sm"
              href="#history"
            >
              History
            </a>
          </nav>
        </div>

        {/* Context Dropdowns & Profile */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container py-1.5 px-3 rounded border border-dg-slate-light cursor-pointer hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              lan
            </span>
            <span className="font-data-mono text-data-mono text-on-surface">
              {clusterName}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              arrow_drop_down
            </span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container py-1.5 px-3 rounded border border-dg-slate-light cursor-pointer hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              category
            </span>
            <span className="font-data-mono text-data-mono text-on-surface">
              {categoryName}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              arrow_drop_down
            </span>
          </div>
          <div className="h-6 w-px bg-outline-variant mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <button
              aria-label="notifications"
              className="text-primary-container hover:bg-surface-variant p-1.5 rounded transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              aria-label="settings"
              className="text-primary-container hover:bg-surface-variant p-1.5 rounded transition-colors"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer pl-2">
              <div className="text-right hidden lg:block">
                <div className="font-data-mono text-data-mono text-on-surface">
                  Aarchi Jain
                </div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">
                  Category Manager
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container text-dg-navy font-bold flex items-center justify-center border border-primary-container text-xs">
                AJ
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
