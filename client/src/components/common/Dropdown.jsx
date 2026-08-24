import React from "react";

export default function Dropdown({ label, value, onChange, options = [] }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="font-medium text-[#707a8c] text-xs">{label}</label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#f2f5fa] border border-[#e3e8f0] text-[#171c29] text-sm rounded-lg p-2.5 w-full appearance-none cursor-pointer pr-8 outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#707a8c] text-xs font-bold">
          ∨
        </div>
      </div>
    </div>
  );
}
