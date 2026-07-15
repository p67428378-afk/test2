import React from "react";

export default function Header({ onSubmitPlan }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 bg-surface border-b border-surface-container-high">
      <div className="flex items-center gap-6">
        <span className="text-headline-md font-headline-md font-black text-primary">
          Dollar General
        </span>
        <span className="hidden md:block text-label-sm font-label-sm text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">
          Cluster Assortment Advisor
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a
          className="text-primary border-b-2 border-primary pb-1 font-bold text-label-sm opacity-80 scale-95 transition-all"
          href="#"
        >
          Dashboard
        </a>
        <a
          className="text-on-surface-variant hover:text-on-surface text-label-sm hover:bg-surface-variant transition-colors rounded px-2 py-1"
          href="#"
        >
          Scenarios
        </a>
        <a
          className="text-on-surface-variant hover:text-on-surface text-label-sm hover:bg-surface-variant transition-colors rounded px-2 py-1"
          href="#"
        >
          Audit Logs
        </a>
        <a
          className="text-on-surface-variant hover:text-on-surface text-label-sm hover:bg-surface-variant transition-colors rounded px-2 py-1"
          href="#"
        >
          Reports
        </a>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-full border border-surface-container-high hidden lg:inline-block">
          Small Town Value Cluster - Snacks
        </span>
        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
          notifications
        </button>
        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
          settings
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-surface-container-highest flex items-center justify-center overflow-hidden">
          <img
            alt="Category Manager Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjUPpSKp2iRt3f-cmGbXt_BMg3hhNVbBn3XEu0Qah-0Bjdi4SXLr2fqGKBDBzUEBLIpaVyDhDNG519IicvNV2rVF7K7gEwLBAAguN1_XWRPft7c79nuZ9VJZ-8QrCaYX7QG-yoGFCf__jLDuEBKVp7XPXZ_7lZnbX_q84hZLIdzqH3y0ZNzFxUgRWT7AB5G4IA6-ohGmPyjko26Spkl12Nr4D-8-C77PNKNm6taB1JtXpD9bMcAwmQxYsHIvntIVqflLWap2WFOm4"
          />
        </div>
        <button
          onClick={onSubmitPlan}
          className="bg-primary-container text-on-primary-container text-label-sm font-label-sm px-4 py-2 rounded-md font-bold hover:opacity-90 transition-opacity hidden sm:block"
        >
          Submit Plan
        </button>
      </div>
    </nav>
  );
}
