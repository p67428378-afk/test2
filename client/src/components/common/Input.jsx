import React from "react";

export default function Input({
  label,
  id,
  type = "text",
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-400 uppercase"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-2 bg-slate-800 border ${
          error
            ? "border-rose-500 focus:border-rose-500"
            : "border-slate-700 focus:border-emerald-500"
        } rounded-lg text-slate-100 focus:outline-none text-sm transition-colors`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
}
