import React from 'react';
import { Bell, Plus, Menu, Search } from 'lucide-react';

export default function Header({ onNewQuoteClick, onSearchChange, searchQuery }) {
  return (
    <header className="fixed top-0 right-0 h-[64px] left-0 md:left-[280px] bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm flex justify-between items-center px-6 z-30 transition-all duration-200">
      {/* Mobile Menu Button */}
      <button className="md:hidden text-on-surface-variant hover:text-on-surface">
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Brand */}
      <span className="md:hidden font-bold text-lg text-on-surface tracking-tight">GlassFlow Pro</span>

      {/* Search (Left on Desktop) */}
      <div className="hidden md:flex items-center relative w-[320px]">
        <Search className="absolute left-3 text-on-surface-variant h-5 w-5" />
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-shadow placeholder:text-on-surface-variant/50"
          placeholder="Search orders, quotes, customers..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative text-on-surface-variant hover:text-on-surface transition-colors p-1">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-surface-container-low"></span>
        </button>
        <button
          onClick={onNewQuoteClick}
          className="bg-brand-indigo hover:bg-brand-indigo/90 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Quote</span>
        </button>
      </div>
    </header>
  );
}