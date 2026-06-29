import React from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-full">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 rounded-full border border-outline-variant bg-surface focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors shadow-sm"
      />
    </div>
  );
}
