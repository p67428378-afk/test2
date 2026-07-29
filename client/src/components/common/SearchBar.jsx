import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-shadow outline-none"
      />
    </div>
  );
}
