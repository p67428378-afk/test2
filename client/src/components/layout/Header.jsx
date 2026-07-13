import React from "react";
import { Search, Lock, Bell, Plus } from "lucide-react";

export default function Header({ searchQuery, setSearchQuery, onAddClick }) {
  return (
    <header className="fixed top-0 right-0 h-[64px] w-[calc(100%-260px)] bg-surface-dim/80 backdrop-blur-md flex justify-between items-center px-lg border-b border-outline-variant/10 z-10">
      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-[18px] h-[18px]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#090D16] border border-outline-variant/30 rounded-full py-1.5 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all placeholder:text-on-surface-variant/50"
          placeholder="Search vault..."
        />
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary-container transition-colors focus:ring-1 focus:ring-primary/40 rounded-full p-1">
          <Lock className="w-5 h-5" />
        </button>
        <button className="text-on-surface-variant hover:text-primary-container transition-colors focus:ring-1 focus:ring-primary/40 rounded-full p-1 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full cyber-glow-primary"></span>
        </button>
        <button
          onClick={onAddClick}
          className="ml-2 bg-primary text-[#0F172A] px-4 py-1.5 rounded-lg font-label-md text-label-md font-bold hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Credential
        </button>
      </div>
    </header>
  );
}
