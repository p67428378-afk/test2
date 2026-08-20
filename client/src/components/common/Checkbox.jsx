import React from "react";

export default function Checkbox({ label, checked, onChange, id }) {
  return (
    <div
      className="flex gap-2 items-center cursor-pointer select-none"
      onClick={onChange}
    >
      <div
        id={id}
        className={`w-[18px] h-[18px] rounded-[6px] flex items-center justify-center transition-all ${
          checked ? "bg-[#4f45e5]" : "bg-[#f2f5fa] border border-[#e0e5f0]"
        }`}
      >
        {checked && <span className="text-[12px] text-white font-bold">✓</span>}
      </div>
      {label && (
        <span className="text-sm text-[#1f293b] font-medium">{label}</span>
      )}
    </div>
  );
}
