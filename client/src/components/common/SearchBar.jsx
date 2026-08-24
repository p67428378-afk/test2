import React from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="bg-[#f2f5fa] border border-[#e3e8f0] flex items-center gap-2 px-3 py-2.5 rounded-lg w-full">
      <span className="text-[#707a8c] text-sm">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-sm text-[#171c29] placeholder-[#707a8c] w-full"
      />
    </div>
  );
}
