import React from 'react';
import { Bell, HelpCircle, Grid, Menu, Search } from 'lucide-react';

export default function Header({ onSearchChange, searchValue }) {
  return (
    <header className="h-[64px] bg-surface-dim border-b border-outline-variant flex justify-between items-center px-6 shrink-0 sticky top-0 z-20">
      {/* Mobile Menu Trigger */}
      <button className="md:hidden text-on-surface-variant hover:text-on-surface mr-4">
        <Menu className="w-6 h-6" />
      </button>
      
      {/* Search */}
      <div className="flex-1 max-w-xl flex items-center relative">
        <Search className="absolute left-3 text-on-surface-variant w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={searchValue || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full bg-surface-container-highest border border-outline-variant rounded-md py-2 pl-10 pr-4 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          placeholder="Search customer name, PAN, Aadhaar..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all relative group focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error rounded-full flex items-center justify-center font-label-md text-[10px] border border-surface-dim">5</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface hidden sm:block">
          <Grid className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}