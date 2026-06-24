import React from "react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-inverse-surface flex flex-col p-4 z-20">
      {/* Brand Logo */}
      <div className="mb-8 flex items-center gap-3 px-3">
        <span className="material-symbols-outlined text-primary-container icon-fill text-3xl">
          account_balance
        </span>
        <span className="text-xl font-bold text-surface-container-lowest">
          Apex Retail Bank
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        <a
          className="flex items-center gap-3 px-4 py-3 text-primary-fixed font-bold bg-on-primary-fixed-variant/20 rounded-lg transition-colors duration-100 scale-95 origin-left"
          href="#"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-secondary-fixed-variant hover:text-surface-container-lowest hover:bg-on-primary-fixed-variant/10 transition-colors rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined">analytics</span>
          <span>Scenario Analysis</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-secondary-fixed-variant hover:text-surface-container-lowest hover:bg-on-primary-fixed-variant/10 transition-colors rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined">location_on</span>
          <span>Cluster Review</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-secondary-fixed-variant hover:text-surface-container-lowest hover:bg-on-primary-fixed-variant/10 transition-colors rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined">account_balance</span>
          <span>Portfolio Health</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-secondary-fixed-variant hover:text-surface-container-lowest hover:bg-on-primary-fixed-variant/10 transition-colors rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined">verified_user</span>
          <span>Compliance</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-secondary-fixed-variant hover:text-surface-container-lowest hover:bg-on-primary-fixed-variant/10 transition-colors rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>
      </nav>

      {/* CTA & Profile Footer */}
      <div className="mt-auto flex flex-col gap-4">
        <button className="w-full bg-primary-container text-surface-container-lowest py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Scenario
        </button>
        <div className="border-t border-on-secondary-fixed-variant/30 pt-4 px-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
            <img
              alt="Sarah Jenkins"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4F1jzGF1OdIuk7GzxeSFvG98fgLdpdTPP5nuqqjkTW49luBC9wYd-VAA00E290dkect-Be_QvHcnQww2OOYmn8mhT1gZVCKAXiAt1b42oBtSb15DGvGm18fcMbudnkPeJrCVwJCSgxBylliIqFessxKvY9ZkhDVshJ7Lq77Rr0qNsha4MbecukPcxLN_CZYILAePfIbLd1Ofu39HHgWv43x0QrOGn1aDAE0gmipZbw-acmXVZEfQLyaqYoy7F_hADsry9aGftMStR"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-surface-container-lowest">
              Sarah Jenkins
            </span>
            <span className="text-[10px] text-on-secondary-fixed-variant">
              Product Manager, Rural
            </span>
          </div>
        </div>
        <div className="flex gap-2 px-3 mt-2">
          <a
            className="text-on-secondary-fixed-variant hover:text-surface-container-lowest transition-colors flex items-center gap-1 text-[11px]"
            href="#"
          >
            <span className="material-symbols-outlined text-[16px]">
              help_outline
            </span>{" "}
            Support
          </a>
          <a
            className="text-on-secondary-fixed-variant hover:text-surface-container-lowest transition-colors flex items-center gap-1 text-[11px] ml-auto"
            href="#"
          >
            <span className="material-symbols-outlined text-[16px]">
              logout
            </span>{" "}
            Sign Out
          </a>
        </div>
      </div>
    </aside>
  );
}
