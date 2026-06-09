import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0F172A] border border-outline-variant/50 text-on-surface text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-shadow placeholder:text-on-surface-variant/50"
        placeholder={placeholder}
      />
    </div>
  );
}