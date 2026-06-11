import React from 'react';

export default function Header({ title, setIsSidebarOpen, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex items-center justify-between px-lg h-16 w-full">
      <div className="flex items-center gap-md">
        <button
          className="lg:hidden text-primary p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-lg">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-surface-container-low border border-outline-variant rounded-full px-md py-1 w-64 focus-within:border-primary transition-all">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-body-md text-on-surface w-full focus:outline-none px-2 py-1"
            placeholder="Search..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-md">
          <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 bg-tertiary-container text-on-tertiary-container text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              2
            </span>
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className="hidden sm:flex items-center gap-sm bg-primary-container text-on-primary-container px-lg py-2 rounded-lg font-label-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">sync_alt</span>
            Transfer Money
          </button>
        </div>
      </div>
    </header>
  );
}
