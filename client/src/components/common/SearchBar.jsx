import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search className="absolute left-3 text-on-surface-variant w-5 h-5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-container-highest border border-outline-variant rounded-md py-2 pl-10 pr-4 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
        placeholder={placeholder}
      />
    </div>
  );
}