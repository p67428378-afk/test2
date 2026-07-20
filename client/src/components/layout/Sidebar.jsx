import React from "react";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      id="mobile-sidebar"
      className={`fixed left-0 top-0 h-full w-[280px] bg-surface dark:bg-surface-dim border-r border-outline-variant dark:border-outline flex flex-col py-stack-md z-20 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="px-gutter mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-[32px]">
          book_2
        </span>
        <div>
          <h1 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
            AthenaLib
          </h1>
          <p className="text-label-md font-label-md text-on-surface-variant">
            Library Management
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-2">
        <a
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary dark:text-primary-fixed-dim font-bold border-l-2 border-primary dark:border-primary-fixed-dim bg-primary-container/10 active:scale-[0.98] transition-transform duration-150"
          href="#"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="text-body-md font-body-md">Search Catalog</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-200"
          href="#"
        >
          <span className="material-symbols-outlined">book_2</span>
          <span className="text-body-md font-body-md">My Bookshelf</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-200"
          href="#"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="text-body-md font-body-md">Borrowing History</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-200"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-body-md font-body-md">Settings</span>
        </a>
      </nav>

      {/* Profile */}
      <div className="px-4 mt-auto">
        <div className="border-t border-outline-variant dark:border-outline pt-4">
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-200"
            href="#"
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span className="text-body-md font-body-md">Alex Mercer</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
