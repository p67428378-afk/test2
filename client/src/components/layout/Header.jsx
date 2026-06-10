import React from 'react';

export default function Header({ onRegisterClick }) {
  return (
    <header className="h-[64px] fixed top-0 right-0 left-[260px] z-40 bg-surface border-b border-outline-variant flex justify-between items-center px-margin-desktop">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-sm focus:border-primary focus:ring-0 transition-all outline-none text-on-surface"
            placeholder="Search cases, families, or records..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all active:opacity-80">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>
        <button
          onClick={onRegisterClick}
          className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary-container/10"
        >
          Register New Intake
        </button>
      </div>
    </header>
  );
}