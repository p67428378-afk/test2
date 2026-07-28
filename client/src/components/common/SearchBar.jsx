import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] h-4 w-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0F172A] border border-[#334155] rounded-md py-2 pl-10 pr-4 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] shadow-inner placeholder-[#c7c4d7]/50"
        placeholder={placeholder}
      />
    </div>
  );
}
