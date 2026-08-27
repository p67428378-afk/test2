import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search shows, episodes, hosts, or keywords...",
}) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707a8c]">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-[#f2f5fa] border border-[#e3e8f0] rounded-xl text-sm text-[#171c29] placeholder-[#707a8c] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:border-transparent transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#707a8c] hover:text-[#171c29]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
