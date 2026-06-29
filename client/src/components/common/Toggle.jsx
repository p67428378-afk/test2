import React from "react";

export default function Toggle({ label, checked, onChange, className = "" }) {
  return (
    <label
      className={`flex items-center justify-between cursor-pointer ${className}`}
    >
      {label && (
        <span className="text-sm font-medium text-on-surface-variant">
          {label}
        </span>
      )}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-focus:ring-1 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-on-surface-variant after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-on-primary"></div>
      </div>
    </label>
  );
}
